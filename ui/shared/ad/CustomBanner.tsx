import { Box, Flex, Image, Link, chakra } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import type { BannerProps } from './types';
import type { CustomAdConfig } from 'types/client/adCustomConfig';

import useIsMobile from 'lib/hooks/useIsMobile';
import Skeleton from 'ui/shared/chakra/Skeleton';

interface CustomBannerProps extends BannerProps {
  configUrl: string; // 配置文件URL
}

const CustomBanner = ({ className, platform, configUrl }: CustomBannerProps) => {
  const [ index, setIndex ] = useState(0);

  const isMobileViewport = useIsMobile();
  const isMobile = platform === 'mobile' || isMobileViewport;

  // ✅ 用 React Query 获取配置
  const { data: config, isLoading } = useQuery<CustomAdConfig>({
    queryKey: [ 'custom-ad-config', configUrl ],
    queryFn: async(): Promise<CustomAdConfig> => {
      const res = await fetch(configUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch ad config: ${ res.status }`);
      }
      return res.json() as Promise<CustomAdConfig>;
    },
    enabled: Boolean(configUrl),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    retry: 1,
  });

  // ✅ 初始化随机起始广告
  useEffect(() => {
    if (!config?.banners?.length) return;

    if (config.randomStart) {
      setIndex(Math.floor(Math.random() * config.banners.length));
    } else {
      setIndex(0);
    }
  }, [ config ]);

  // ✅ 轮播逻辑
  useEffect(() => {
    if (!config?.banners?.length || config.banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndex(prev => {
        if (config.randomNextAd) {
          let next;
          do {
            next = Math.floor(Math.random() * config.banners.length);
          } while (next === prev);
          return next;
        }
        return (prev + 1) % config.banners.length;
      });
    }, config.interval);

    return () => clearInterval(timer);
  }, [ config ]);

  // 加载中
  if (isLoading) {
    return (
      <Skeleton
        className={ className }
        h={{ base: '50px', lg: '90px' }}
        w={{ base: '320px', lg: '728px' }}
      />
    );
  }

  // 无数据或失败 → 静默
  if (!config?.banners?.length) return null;

  const ad = config.banners[index];
  const imageUrl = isMobile ? ad.mobileImageUrl : ad.desktopImageUrl;

  const size = isMobile ? { w: '320px', h: '50px' } : { w: '728px', h: '90px' };

  return (
    <Link href={ ad.url } isExternal _hover={{ textDecoration: 'none' }}>
      <Flex
        className={ className }
        { ...size }
        position="relative"
        overflow="hidden"
        borderRadius="md"
        transition="0.2s"
        _hover={{ transform: 'scale(1.02)' }}
      >
        <Image
          src={ imageUrl }
          alt={ ad.text }
          { ...size }
          objectFit="cover"
          loading="lazy"
          fallbackStrategy="onError"
        />

        <Box
          position="absolute"
          top="2"
          right="2"
          bg="blackAlpha.600"
          color="white"
          fontSize="xs"
          px="2"
          py="1"
          borderRadius="sm"
        >
          Ad
        </Box>
      </Flex>
    </Link>
  );
};

export default chakra(CustomBanner);
