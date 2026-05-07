import dotenv from "dotenv"
dotenv.config()

import { connectRedis, setCache, getCache, deleteCache } from './config/redis'

const test = async () => {
  await connectRedis()

  // save something
  await setCache("test:key", { name: "John", role: "trucker" }, 60)
  console.log("Saved to cache")

  // get it back
  const data = await getCache<{ name: string, role: string }>("test:key")
  console.log("Got from cache:", data)

  // delete it
  await deleteCache("test:key")
  console.log("Deleted from cache")

  // try to get deleted key
  const deleted = await getCache("test:key")
  console.log("After delete:", deleted) // should be null
}

test()