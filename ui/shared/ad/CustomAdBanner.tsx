import { Flex, chakra, Tooltip, Image } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import shuffle from 'lodash/shuffle';
import React, { useState, useEffect, useMemo } from 'react';

import type { AdCustomConfig } from 'types/client/adProviders';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import { MINUTE } from 'lib/consts';
import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import Skeleton from 'ui/shared/chakra/Skeleton';

const CustomAdBanner = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();

  const feature = config.features.adsBanner;
  const configUrl = (feature.isEnabled && feature.provider === 'custom' && 'configUrl' in feature) ? feature.configUrl : '';

  const apiFetch = useFetch();
  const { data: adConfig, isLoading, isError } = useQuery<AdCustomConfig, ResourceError<unknown>>({
    queryKey: [ 'ad-banner-custom-config' ],
    queryFn: async() => {
      const result = await apiFetch(configUrl);
      if ((result as ResourceError<unknown>).status !== undefined) {
        throw result;
      }
      return result as AdCustomConfig;
    },
    enabled: feature.isEnabled && feature.provider === 'custom',
    staleTime: Infinity,
  });

  const interval = adConfig?.interval || MINUTE;
  const randomStart = adConfig?.randomStart || false;
  const randomNextAd = adConfig?.randomNextAd || false;

  const banners = useMemo(() => {
    const baseBanners = adConfig?.banners ?? [];
    return randomNextAd ? shuffle(baseBanners) : baseBanners;
  }, [ adConfig?.banners, randomNextAd ]);

  const [ currentBannerIndex, setCurrentBannerIndex ] = useState(() => {
    if (banners.length === 0) return 0;
    return randomStart ? Math.floor(Math.random() * banners.length) : 0;
  });

  // 当 banners 变化时重置索引
  useEffect(() => {
    if (banners.length > 0) {
      setCurrentBannerIndex(randomStart ? Math.floor(Math.random() * banners.length) : 0);
    }
  }, [ banners, randomStart ]);

  // 轮播定时器
  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [ interval, banners.length ]);

  if (isLoading) {
    return <Skeleton className={ className } width="100%" height="90px"/>;
  }

  if (isError || !adConfig || banners.length === 0) {
    return <Flex className={ className } h="90px"/>;
  }

  const currentBanner = banners[currentBannerIndex];
  if (!currentBanner) {
    return <Flex className={ className } h="90px"/>;
  }

  return (
    <Flex className={ className } h="90px">
      <Tooltip label={ currentBanner.text } aria-label={ currentBanner.text }>
        <a href={ currentBanner.url } target="_blank" rel="noopener noreferrer">
          <Image
            src={ isMobile ? currentBanner.mobileImageUrl : currentBanner.desktopImageUrl }
            alt={ currentBanner.text }
            height="100%"
            width="auto"
            borderRadius="md"
            fallback={ <Skeleton width={ isMobile ? '270px' : '728px' } height="90px"/> }
          />
        </a>
      </Tooltip>
    </Flex>
  );
};

export default chakra(CustomAdBanner);
