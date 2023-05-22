import { CacheArgs } from '@/types/cache-proxy.type';
import { createClient } from 'redis';
import { RedisJSON } from '@redis/json/dist/commands';
import { from, lastValueFrom, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

export class CacheProxyService {
  constructor(
    protected readonly client = createClient({
      url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ) {
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect().then(() => console.log('Redis Client Connected'));
  }

  public performCachedCall<T extends {} | null>(
    { key, ttl }: CacheArgs,
    func: (...args: any) => Promise<T>,
    ...args: any
  ): Promise<T> {
    return lastValueFrom(
      from(this.client.json.get(key)).pipe(
        map((data) => {
          if (data) {
            return of(JSON.parse(data as string));
          } else {
            return from(func(...args)).pipe(
              mergeMap((data) => {
                return data
                  ? from(
                      new Promise((resolve) => {
                        this.client.json
                          .set(key, '$', data as RedisJSON)
                          .then(() => {
                            if (ttl) {
                              return this.client.expire(key, ttl).then(() => {
                                resolve(JSON.parse(data as unknown as string));
                              });
                            }

                            resolve(JSON.parse(data as unknown as string));
                          });
                      }),
                    )
                  : of(null);
              }),
              catchError((err) => {
                console.error(
                  `[CacheProxy] Error while performing cached call: ${err.message}`,
                );
                return of(null);
              }),
            );
          }
        }),
        mergeMap((data) => data),
        map((data) => data as unknown as T),
      ),
    );
  }

  public clearCache(key: string): Promise<number> {
    return this.client.del(key);
  }
}
