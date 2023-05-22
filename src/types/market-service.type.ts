import { MarketItemListing } from './market-item-listing.type';

export interface MarketService {
  getItemListing(marketHashName: string): Promise<MarketItemListing | null>;
}
