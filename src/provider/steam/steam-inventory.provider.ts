import { InventoryService } from '@/types/inventory-service.type';
import { Inventory } from '@/types/steam.type';
import { TEN_SECONDS } from '@common/readable-times';
import { SteamWebApi } from './steam-web-api';

export class SteamInventoryService
  extends SteamWebApi
  implements InventoryService
{
  getInventory(steamId: string): Promise<Inventory> {
    return this.cacheProxyService.performCachedCall<Inventory>(
      {
        key: `inventory-${steamId}`,
        ttl: TEN_SECONDS,
      },
      async () => {
        const inventory = await this.axios.get<Inventory>('inventory', {
          params: {
            steam_id: steamId,
          },
        });

        if (inventory.status !== 200) {
          console.log(inventory);
          throw new Error('Failed to get inventory');
        }

        return inventory.data;
      },
    );
  }
}
