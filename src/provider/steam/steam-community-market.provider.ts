import { MarketService } from '@/types/market-service.type';
import { TEN_SECONDS } from '@common/readable-times';
import { Axios } from 'axios';
import { SteamWebApi } from './steam-web-api';
import { MarketItemListing } from '@/types/market-item-listing.type';

export class SteamCommunityMarketService
  extends SteamWebApi
  implements MarketService
{
  protected axios: Axios;

  async getItemListing(
    marketHashName: string,
  ): Promise<MarketItemListing | null> {
    const item =
      await this.cacheProxyService.performCachedCall<MarketItemListing | null>(
        {
          key: `item-${btoa(encodeURIComponent(marketHashName))}`,
          ttl: TEN_SECONDS,
        },
        async () => {
          const item = await this.axios.get<MarketItemListing | null>('item', {
            params: {
              market_hash_name: marketHashName,
            },
          });

          console.log(marketHashName);

          if (item.status == 404) {
            return null;
          }

          if (item.status !== 200) {
            console.log(item);
            throw new Error(`Failed to get item: ${marketHashName}`);
          }

          return item.data;
        },
      );

    return item;
  }
}
