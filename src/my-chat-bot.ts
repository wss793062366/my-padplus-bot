/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  Message,
  FileBox,
  ScanStatus,
  Wechaty,
  log,
} from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import { generate } from 'qrcode-terminal'
import { Config } from '../config/config'
import { Md5 } from 'md5-typescript'
import * as request from 'request-promise-native'
import { JFGoodsInfo, CpsInfo, UrlInfo } from './model'
/**
 * You can ignore the next line becasue it is using for CodeSandbox
 */
//   require('./.util/helper')

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.text() === 'ding') {
    await msg.say('dong')
  }

  if (msg.type() === bot.Message.Type.Text) {
    if (msg.text().includes('#查询商品：')) {
      queryJingFenGoodsAndSendMsg(msg);
    } else if (msg.text().includes('ready stop')) {
      console.log('ready stop');
    }
  }
}

const token = Config.TOKEN;

const puppet = new PuppetPadplus({
  token,
})
const bot = new Wechaty({
  name: 'shixin-chat-bot',
  puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))

const eliteIds: Array<Number> =
  [
    1, //好券商品,
    22, //热销爆品,
    2, //超级大卖场,
    10, //9.9专区,
    23, //为你推荐
  ];
var eliteIdIndex = 0;
var pageSize: Number = 20;
/**
 * QueryJFGoodsAndSendMsg
 */
function queryJingFenGoodsAndSendMsg(msg: Message) {
  var eliteId: Number = 1;
  // 查询商品
  queryJingFenGoods(eliteId).then(res => {
    var index = 0
    if (eliteIdIndex < eliteIds.length) {
      eliteId = eliteIds[eliteIdIndex];
      eliteIdIndex++;
    } else {
      eliteIdIndex = 0;
    }

    if (index < res.length) {
      var goods: JFGoodsInfo = res[index];
      index++;
      // 领链
      getCpsUrl(goods).then(res => {
        var cpsInfo: CpsInfo = res;
        // 发消息
        sendPromotionMsg(msg, goods, cpsInfo)
      });
    }

  }, rej => {
    console.log('rej = ', rej);
  });
}

/**
 * 根据类目查询商品
 */
async function queryJingFenGoods(eliteId: Number) {
  return new Promise((resolve: (value: Array<JFGoodsInfo>) => void, reject) => {
    var uParam = {
      goodsReq: {
        pageIndex: 1,
        pageSize: pageSize,
        eliteId: eliteId
      },
    };

    requestAPI('https://router.jd.com/api', JSON.stringify(uParam))
      .then(res => {
        if (res.code === '0') {
          var dataArr = res.data;
          var list = [];
          for (let d of dataArr) {
            var goods = new JFGoodsInfo(d)
            list.push(goods);
          }

          resolve(list)
        }
      }, rej => {
        reject('Server error');
      });
  });
}

/**
 * 领链
 */
async function getCpsUrl(goodsInfo: JFGoodsInfo) {
  return new Promise((resolve: (value: CpsInfo) => void) => {
    var materialId: string = goodsInfo.materialUrl;
    // console.log('indexof http = ', materialId.indexOf('http'))
    if (materialId.indexOf('http') !== 0) {
      materialId = 'https://' + materialId;
    }
    const appId = 000000; // your app id

    var promotionCodeReq = {
      materialId: materialId,
      siteId: appId,
      positionId: 000000, // your positionId
      couponUrl: ''
    }

    var coupon = goodsInfo.couponInfo.couponList[0];
    if (coupon && coupon.link) {
      promotionCodeReq.couponUrl = encodeURIComponent(coupon.link);
    }
    var uParam = {
      promotionCodeReq
    }

    requestAPI('https://router.jd.com/api', JSON.stringify(uParam))
      .then(res => {
        if (res.code === '0') {
          var cpsInfo: CpsInfo = res.data;
          // 发品
          resolve(cpsInfo);
        }
      });
  });
}

/**
 *
 */
function sendPromotionMsg(msg: Message, goods: JFGoodsInfo, cpsInfo: CpsInfo) {
  (async () => {
    // 发商品图
    var urlInfo: UrlInfo = goods.imageInfo.imageList[0];
    if (urlInfo.url) {
      const fileBox = FileBox.fromUrl(urlInfo.url)
      await msg.say(fileBox);
    }

    // 发送商品信息
    var jd;
    if (goods.owner === 'g') {
      jd = '京东自营';
    } else {
      jd = '京东';
    }

    var text = '【' + jd + '】' + goods.skuName + '\n\r'
      + '----------------' + '\n'
      + '京东价：¥ ' + goods.priceInfo.price + '\n'
      + '券后价：¥ ' + goods.priceInfo.lowestCouponPrice + '\n\r'
      + '商品入口：' + cpsInfo.clickURL

    await msg.say(text);
  })();
}

function requestAPI(apiMethod: string, bParamJson: string) {
  const baseUrl = 'https://router.jd.com/api?';
  return new Promise((resolve, reject) => {
    var options = {
      uri: encodeURI(baseUrl + 'param_json=' + bParamJson),
    };
    request.get(options)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  })
}
