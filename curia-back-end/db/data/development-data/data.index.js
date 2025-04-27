import { readFile } from "fs/promises";

function loadData() {
  return readFile(`${__dirname}/users.json`, "utf8")
    .then((data) => {
      return JSON.parse(data);
    })
    .catch((err) => {
      throw err;
    });
}

const userData = loadData();

export default { userData };
