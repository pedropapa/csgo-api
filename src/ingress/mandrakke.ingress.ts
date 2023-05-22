import { InventoryService } from '@/types/inventory-service.type';
import { MarketService } from '@/types/market-service.type';
import { InventoryTagCategory } from '@/types/steam.type';
import { Express } from 'express';

export const mandrakkeIngress = (
  app: Express,
  marketService: MarketService,
  inventoryService: InventoryService,
) => {
  app.get('/mandrakke/inventory', async (req, res) => {
    try {
      const playerInventory = await inventoryService.getInventory(
        process.env.MANDRAKKE_STEAM_ID || '',
      );

      console.log(Object.values(playerInventory).length);

      const filtered = playerInventory.descriptions.filter(
        (item) =>
          item.marketable === 1 &&
          item.tags.find(
            (tag) =>
              tag.category === InventoryTagCategory.Rarity &&
              ['Covert', 'Classified', 'Extraordinary'].indexOf(
                tag.localized_tag_name,
              ) !== -1,
          ),
      );

      const result = [];

      for (const item of filtered) {
        const marketItem = await marketService.getItemListing(
          item.market_hash_name,
        );

        if (marketItem) {
          result.push({
            marketName: marketItem.marketName,
            borderColor: marketItem.borderColor,
            type: marketItem.type,
            priceSafe: marketItem.priceSafe,
            priceLatest: marketItem.priceLatest,
            priceAvg: marketItem.priceAvg,
            priceMax: marketItem.priceMax,
            priceMedian: marketItem.priceMedian,
            priceMin: marketItem.priceMin,
            itemImages: marketItem.itemImages,
            slug: marketItem.slug,
            wear: marketItem.wear,
          });
        }
      }

      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message?.replace(/^.*?\{/, '{'),
      });
    }
  });

  //   app.get("/download/(*)", async (req: Request, res: Response) => {
  //     const { token } = req.query;
  //     const fileName = req.params[0];

  //     if (!fileName) {
  //       return res.status(400).json({
  //         error: "File name is required",
  //       });
  //     }

  //     try {
  //       const challenge = await checkRecaptchaChallenge(token as string);

  //       if (!challenge) {
  //         return res.status(400).json({
  //           error: "Recaptcha challenge failed",
  //         });
  //       }

  //       const url = await createPresignedUrl(fileName as string);

  //       res
  //         .status(200)
  //         .setHeader("Access-Control-Allow-Origin", "https://blog.brz.gg")
  //         .json({ url });
  //     } catch (err: any) {
  //       res.status(500).json({
  //         message: err.message?.replace(/^.*?\{/, "{"),
  //       });
  //     }
  //   });

  return app;
};
