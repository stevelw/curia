import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const ENV = process.env.NODE_ENV || "development";
// eslint-disable-next-line no-redeclare
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-redeclare
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME needs to be set for this environment.");
}

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);

await client.connect();

const db = client.db(process.env.DB_NAME);

export default db;
export { client };
