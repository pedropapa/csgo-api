const WebApiContext = {
  Inventory: 2,
} as const;

const CSGOAppId = 730 as const;

const InventoryContextId = 2 as const;

export const InventoryTagCategory = {
  Exterior: 'Exterior',
  Rarity: 'Rarity',
  Quality: 'Quality',
  ItemSet: 'ItemSet',
  Weapon: 'Weapon',
  Type: 'Type',
} as const;

const DescriptionType = {
  HTML: 'html',
} as const;

export type Inventory = {
  assets: InventoryAsset[];
  descriptions: InventoryDetails[];
};

export type InventoryAsset = {
  appid: number;
  contextid: number;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
};

export type InventoryAction = {
  link: string;
  name: string;
};

export type InventoryDetails = {
  appid: number;
  classid: string;
  instanceid: string;
  currency: number;
  background_color: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: InventoryDescription[];
  tradable: number;
  actions: InventoryAction[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  market_actions: InventoryAction[];
  commodity: number;
  market_tradable_restriction: number;
  marketable: number;
  tags: InventoryTag[];
  fraudwarnings: string[];
};

export type InventoryDescription = {
  type: typeof DescriptionType;
  value: string;
};

export type InventoryTag = {
  category: keyof typeof InventoryTagCategory;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
};

export default {
  WebApiContext,
  InventoryTagCategory,
  DescriptionType,
  CSGOAppId,
  InventoryContextId,
};
