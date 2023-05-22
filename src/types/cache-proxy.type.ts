export type CacheArgs = {
  key: string;
  ttl?: number;
};

export interface CacheProxyInterface {
  performCachedCall<T>(
    cacheArgs: CacheArgs,
    func: (...args: any) => Promise<T>,
    ...args: any
  ): Promise<T>;

  clearCache(key: string): Promise<void>;
}
