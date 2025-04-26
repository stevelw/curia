import { connectToDatabase, mongoDb } from "./connection.js";
const setup = async () => {
  await connectToDatabase();
  await mongoDb.db?.dropCollection("users");
  mongoDb.client.close();
};

void setup();
