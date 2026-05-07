import Redis from "ioredis";
import logger from "./logger";

let redisClient: Redis | null = null

const connectRedis = async (): Promise<void> => {
  return new Promise((resolve) => {

    redisClient = new Redis(process.env.REDIS_URL as string, {
      // if redis is down, dont crash — just queue commands
      enableOfflineQueue: true,

      // how many times to retry and how long to wait between retries
      retryStrategy(attempt) {
        if (attempt > 5) {
          logger.error("Redis max retries reached. Continuing without Redis.")
          return null // stop retrying
        }
        const delay = Math.min(attempt * 500, 3000)
        logger.warn(`Redis retry attempt ${attempt}, waiting ${delay}ms...`)
        return delay
      },
    })

    redisClient.on("connect", () => {
      logger.info("Redis connected")
      resolve()
    })

    redisClient.on("error", (err) => {
      logger.error(`Redis error: ${err.message}`)
    })

    redisClient.on("close", () => {
      logger.warn("Redis connection closed")
    })

    // if redis doesnt connect in 10 seconds, continue without it
    // app still works, just without caching and rate limiting
    setTimeout(() => {
      if (!redisClient || redisClient.status !== "ready") {
        logger.warn("Redis timeout. App continuing without Redis.")
        resolve()
      }
    }, 10000)
  })
}

// use this to get redis client anywhere in the app
const getRedisClient = (): Redis | null => {
  return redisClient
}

// save something to cache
// example: setCache("user:123", userData, 300) → expires in 5 minutes
const setCache = async (key: string, value: unknown, ttlSeconds = 300): Promise<void> => {
  if (!redisClient) return
  await redisClient.setex(key, ttlSeconds, JSON.stringify(value))
}

// get something from cache
const getCache = async <T>(key: string): Promise<T | null> => {
  if (!redisClient) return null
  const data = await redisClient.get(key)
  return data ? JSON.parse(data) as T : null
}

// delete something from cache
// call this when data changes so old cache gets cleared
const deleteCache = async (key: string): Promise<void> => {
  if (!redisClient) return
  await redisClient.del(key)
}

export { connectRedis, getRedisClient, setCache, getCache, deleteCache }