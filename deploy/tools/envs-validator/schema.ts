/* eslint-disable max-len */
declare module 'yup' {
  interface StringSchema {
    url(): never;
  }
}

import * as yup from 'yup';
import type { 
  AdButlerConfig, AdTextProviders, AdBannerProviders, AdBannerAdditionalProviders, AdCustomBannerConfig 
} from '../../../types/client/adProviders';
import { SUPPORTED_AD_TEXT_PROVIDERS, SUPPORTED_AD_BANNER_PROVIDERS, SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS } from '../../../types/client/adProviders';
import type { MarketplaceAppBase, MarketplaceAppSocialInfo } from '../../../types/client/marketplace';
import type { NavItemExternal } from '../../../types/client/navigation-items';
import { replaceQuotes } from '../../../configs/app/utils';
import * as regexp from '../../../toolkit/utils/regexp';
import type { IconName } from '../../../ui/shared/IconSvg';
import { ROLLUP_TYPES } from '../../../types/client/rollup';
import { API_DOCS_TABS } from '../../../types/views/apiDocs';
import { ADDRESS_3RD_PARTY_WIDGET_PAGES } from '../../../types/views/address';
import { NETWORK_GROUPS } from '../../../types/networks';
import type { NetworkVerificationTypeEnvs, NetworkExplorer, FeaturedNetwork } from '../../../types/networks';

const protocols = ['http', 'https'];

const urlTest: yup.TestConfig = {
  name: 'url',
  test: (value: unknown) => {
    if (!value) return true;
    try {
      if (typeof value === 'string') {
        new URL(value);
        return true;
      }
    } catch {}
    return false;
  },
  message: '${path} is not a valid URL',
  exclusive: true,
};

// ------------- Marketplace App Schema -------------
const marketplaceAppSchema: yup.ObjectSchema<MarketplaceAppBase & MarketplaceAppSocialInfo> = yup.object({
  id: yup.string().required(),
  external: yup.boolean(),
  title: yup.string().required(),
  logo: yup.string().test(urlTest).required(),
  logoDarkMode: yup.string().test(urlTest),
  shortDescription: yup.string().required(),
  categories: yup.array().of(yup.string().required()).required(),
  url: yup.string().test(urlTest).required(),
  author: yup.string().required(),
  description: yup.string().required(),
  site: yup.string().test(urlTest),
  twitter: yup.string().test(urlTest),
  telegram: yup.string().test(urlTest),
  github: yup.lazy(value =>
    Array.isArray(value)
      ? yup.array().of(yup.string().required().test(urlTest))
      : yup.string().test(urlTest),
  ),
  discord: yup.string().test(urlTest),
  internalWallet: yup.boolean(),
  priority: yup.number(),
});

// ------------- Marketplace Schema -------------
const marketplaceSchema = yup.object().shape({
  NEXT_PUBLIC_MARKETPLACE_ENABLED: yup.boolean(),
  NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: yup
    .array()
    .json()
    .of(marketplaceAppSchema)
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL: yup
    .array()
    .json()
    .of(yup.string())
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema.test(urlTest).required(),
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema.test(urlTest),
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_FEATURED_APP: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema.test(urlTest),
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema.test(urlTest),
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
  NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL: yup
    .string()
    .when('NEXT_PUBLIC_MARKETPLACE_ENABLED', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL cannot be used without NEXT_PUBLIC_MARKETPLACE_ENABLED'),
    }),
});

export {
  urlTest,
  marketplaceAppSchema,
  marketplaceSchema,
};