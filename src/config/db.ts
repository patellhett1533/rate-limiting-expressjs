import { connect, set } from "mongoose";
import logger from "./logger";
import env from "./env";
const MONGO_URI = env.mongodb.url;

const connectDB = async () => {
  set("strictQuery", false);
  await connect(MONGO_URI)
    .then(() => {
      logger.info("MongoDB Connected...");
    })
    .catch(error => {
      logger.error((error as Error).message);
      process.exit(1);
    });
};

export default connectDB;
