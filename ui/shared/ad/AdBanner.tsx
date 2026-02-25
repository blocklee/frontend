import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdBannerContent from './AdBannerContent';
import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import CustomAdBanner from './CustomAdBanner';
import SliseBanner from './SliseBanner';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
}

const AdBanner = ({ className, isLoading, platform }: Props) => {
  const provider = useAppContext().adBannerProvider;

  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!feature.isEnabled || hasAdblockCookie === 'true' || !provider) {
    return null;
  }

  const content = (() => {
    switch (feature.provider) {
      case 'adbutler':
        return <AdbutlerBanner/>;
      case 'coinzilla':
        return <CoinzillaBanner/>;
      case 'slise':
        return <SliseBanner/>;
    }
  })();

  return (
    <AdBannerContent
      className={ className }
      isLoading={ isLoading }
      provider={ provider }
      platform={ platform }
    />
  );
};

export default chakra(AdBanner);
