import devData from "./data/development-data/data.index.js";
import { seed } from "./seed.js";
import { client } from "./connection.js";

const runSeed = () => {
  return seed(devData)
    .then(() => {
      client.close();
    })
    .catch((err) => {
      throw err;
    });
};

runSeed();
