
class JFGoodsInfo {
    brandCode:string; 
    brandName: string;
    categoryInfo: CategoryInfo;
    comments: Number;
    commissionInfo: CommissionInfo;
    couponInfo: CouponInfo;
    goodCommentsShare: Number;
    imageInfo: ImageInfo;
    inOrderCount30Days: Number;
    inOrderCount30DaysSku: Number;
    isHot: Boolean;
    materialUrl: string;
    owner: string;
    pinGouInfo: PingouInfo;
    priceInfo: PriceInfo;
    resourceInfo: ResourceInfo;
    shopInfo: ShopInfo;
    skuId: Number;
    skuName: string;
    spuid: Number;
    seckillInfo: SeckillInfo;
    jxFlags: Array<Number>;
    videoInfo: VideoInfo; 
  
    // 构造
    constructor(data: JFGoodsInfo) {
      this.brandCode = data.brandCode;
      this.brandName = data.brandName;
      this.categoryInfo = data.categoryInfo;
      this.comments = data.comments;
      this.commissionInfo = data.commissionInfo;
      this.couponInfo = data.couponInfo;
      this.goodCommentsShare = data.goodCommentsShare;
      this.imageInfo = data.imageInfo;
      this.inOrderCount30Days = data.inOrderCount30Days;
      this.inOrderCount30DaysSku = data.inOrderCount30DaysSku;
      this.isHot = data.isHot;
      this.materialUrl = data.materialUrl;
      this.owner = data.owner;
      this.pinGouInfo = data.pinGouInfo;
      this.priceInfo = data.priceInfo;
      this.resourceInfo = data.resourceInfo;
      this.shopInfo = data.shopInfo;
      this.skuId = data.skuId;
      this.skuName = data.skuName;
      this.spuid = data.spuid;
      this.seckillInfo = data.seckillInfo;
      this.jxFlags = data.jxFlags;
      this.videoInfo = data.videoInfo;
    }
}
interface CategoryInfo {
    cid1: Number;
    cid1Name: string;
  }
  // 佣金
  interface CommissionInfo {
    commission: Number;
    commissionShare: Number; 
  }
  
  interface CouponInfo {
    couponList: Array<Coupon>;
  }
  
  interface Coupon {
    discount: Number;
    link: string;
    isBest: Number;
  }
  
  interface PriceInfo {
    price: Number;
    lowestPrice: Number;
    lowestPriceType: Number; // 最低价格类型，1：无线价格；2：拼购价格； 3：秒杀价格
    lowestCouponPrice: Number;
  }
  
  interface PingouInfo {
    pingouPrice: Number;
    pingouTmCount: Number;
    pingouUrl: string;
    pingouStartTime: Number;
    pingouEndTime: Number;
  }
  
  interface ImageInfo {
    imageList: Array<UrlInfo>;
  }
  
  interface UrlInfo {
    url: string;
  }
  
  interface ShopInfo {
    shopId: Number;
    shopName: string;
  }
  
  interface ResourceInfo {
    eliteId: Number;
    eliteName: string;
  }
  
  interface SeckillInfo {
    seckillOriPrice: Number;
    seckillPrice: Number;
    seckillStartTime: Number;
    seckillEndTime: Number;
  }
  
  interface VideoInfo {
    videoList: Array<Video>;
  }
  
  interface Video {
    width: Number;
    height: Number;
    imageUrl: string;
    videoType: Number; //1:主图，2：商详
    playUrl: string;
    playType: string; // low：标清，high：高清
    duration: Number;
  }

  interface CpsInfo {
    clickURL: string;
  }

export { JFGoodsInfo, CpsInfo, UrlInfo }