import dotenv from "dotenv";
import express, { Express } from "express";
import serverless from "serverless-http";
import { mandrakkeIngress } from "./src/ingress/mandrakke.ingress";
import { SteamCommunityMarketService } from "./src/provider/steam/steam-community-market.provider";
import { CacheProxyService } from "@/service/cache-proxy.service";
import { SteamInventoryService } from "@/provider/steam/steam-inventory.provider";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

const cacheService = new CacheProxyService();
const marketService = new SteamCommunityMarketService(cacheService);
const inventoryService = new SteamInventoryService(cacheService);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mandrakkeIngress(app, marketService, inventoryService);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

module.exports.handler = serverless(app);
