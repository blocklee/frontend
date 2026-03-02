export type CustomAdBanner = {
  text: string;
  url: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
};

export type CustomAdConfig = {
  banners: Array<CustomAdBanner>;
  interval: number; // 轮播间隔（毫秒）
  randomStart: boolean; // 是否随机开始
  randomNextAd: boolean; // 是否随机选择下一个广告
};
