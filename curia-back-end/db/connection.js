import { MongoClient } from "mongodb";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME needs to be set for this environment.");
}

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);

client.connect();

const db = client.db(process.env.DB_NAME);

export default db;
export { client };
