import { userData } from "./data/development-data/data.index.js";
import { connectToDatabase, mongoDb } from "./connection.js";

const seedDevDb = async () => {
  await connectToDatabase();
  await mongoDb.collections.users.insertMany(userData);
  mongoDb.client.close();
};

void seedDevDb();
