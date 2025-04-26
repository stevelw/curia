import dotenv from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME needs to be set for this environment.");
}

if (!process.env.USERS_COLLECTION_NAME) {
  throw new Error(
    "USERS_COLLECTION_NAME needs to be set for this environment.",
  );
}

export const collections: { users?: Collection } = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: MongoClient = new MongoClient(
    process.env.MONGO_CONNECTION_STRING!,
  );

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const usersCollection: Collection = db.collection(
    process.env.USERS_COLLECTION_NAME!,
  );

  collections.users = usersCollection;
}
