import type { ArrayElement } from 'types/utils';

export const SUPPORTED_AD_BANNER_PROVIDERS = [
  'slise',
  'adbutler',
  'coinzilla',
  'hype',
  'none',
] as const;
export type AdBannerProviders = ArrayElement<typeof SUPPORTED_AD_BANNER_PROVIDERS>;

export const SUPPORTED_AD_TEXT_PROVIDERS = [ 'coinzilla', 'none' ] as const;
export type AdTextProviders = ArrayElement<typeof SUPPORTED_AD_TEXT_PROVIDERS>;
export const SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS = [ 'adbutler' ] as const;
export type AdBannerAdditionalProviders = ArrayElement<typeof SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS>;

export type AdButlerConfig = {
  id: string;
  width: string;
  height: string;
}
export type AdCustomBannerConfig = {
  text?: string;
  url?: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
}

export type AdCustomConfig = {
  banners: Array<AdCustomBannerConfig>;
  interval?: number;
  randomStart?: boolean;
  randomNextAd?: boolean;
}


