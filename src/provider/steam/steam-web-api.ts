import { CacheProxyService } from '@/service/cache-proxy.service';
import { TEN_SECONDS } from '@common/readable-times';
import { Axios } from 'axios';

export class SteamWebApi {
  protected axios: Axios;

  constructor(protected readonly cacheProxyService: CacheProxyService) {
    this.axios = new Axios({
      baseURL: 'https://www.steamwebapi.com/steam/api/',
      timeout: TEN_SECONDS * 6,
      maxRedirects: 1,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: process.env.STEAM_API_KEY,
        game: 'csgo',
        language: 'english',
      },
    });
  }
}
