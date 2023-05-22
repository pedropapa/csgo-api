import { Inventory } from './steam.type';

export interface InventoryService {
  getInventory(steamId: string): Promise<Inventory>;
}
