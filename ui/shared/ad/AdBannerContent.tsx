import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';
import type { AdBannerProviders } from 'types/client/adProviders';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
// import GetitBanner from './GetitBanner';
import CustomBanner from './CustomBanner'; // 导入自定义轮播广告组件
import HypeBanner from './HypeBanner';
import SliseBanner from './SliseBanner';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
  provider: AdBannerProviders;
}

const AdBannerContent = ({ className, isLoading, provider, platform }: Props) => {
  const content = (() => {
    switch (provider) {
      case 'adbutler':
        return <AdbutlerBanner platform={ platform }/>;
      case 'coinzilla':
        return <CoinzillaBanner platform={ platform }/>;
      // case 'getit':
      //   return <GetitBanner platform={ platform }/>;
      case 'hype':
        return <HypeBanner platform={ platform }/>;
      case 'slise':
        return <SliseBanner platform={ platform }/>;
      case 'custom':
        // 类型断言（当确定 feature 一定是 custom 类型时）
        return <CustomBanner platform={ platform } configUrl={ (feature as { customConfigUrl: string }).customConfigUrl }/>;
    }
  })();

  // 获取最大宽度（可选）
  const maxWidth = (() => {
    if ('adButler' in feature && feature.adButler) {
      return `${ feature.adButler.config.desktop.width }px`;
    }
    if (provider === 'custom') {
      return '728px';
    }
    return '728px';
  })();

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      borderRadius="none"
      maxW={ maxWidth }
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBannerContent);
