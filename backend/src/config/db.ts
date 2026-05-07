import mongoose from "mongoose"
import logger from "./logger"

const MAX_RETRIES = 5
const RETURN_DELAY_MS = 5000 //5SEC

const connectDB = async ( retryCount = 0): Promise<void> =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        logger.info(`MongoDb connected: ${conn.connection.host}`)
    }catch(error){
        retryCount++
        logger.error(`MongoDb connection failed (attempt ${retryCount}/${MAX_RETRIES}): ${error}`)

        if(retryCount<MAX_RETRIES){
            logger.info(`Retrying in ${RETURN_DELAY_MS / 1000} seconds...`)

            await new Promise((resolve) => setTimeout(resolve,RETURN_DELAY_MS))

            return connectDB(retryCount)
        }

        logger.error("All retries failed")
        process.exit(1)
    }
}

mongoose.connection.on("disconnected",()=>{
    logger.warn("MongoDb disconnected")
})

mongoose.connection.on("reconnected",()=>{
    logger.info("MongoDb reconnected")
})

export default connectDB    
