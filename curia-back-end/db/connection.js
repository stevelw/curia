import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME needs to be set for this environment.");
}

export const mongoDb = { collections: {} };

export async function connectToDatabase() {
  mongoDb.client = new MongoClient(process.env.MONGO_CONNECTION_STRING);

  await mongoDb.client.connect();

  mongoDb.db = mongoDb.client.db(process.env.DB_NAME);

  mongoDb.collections.users = mongoDb.db.collection("users");
}
