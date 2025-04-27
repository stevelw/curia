import { readFile } from "fs/promises";
import User from "src/users/user.interface";

function loadData() {
  return readFile(`${__dirname}/users.json`, "utf8")
    .then((data) => {
      return JSON.parse(data) as User[];
    })
    .catch((err) => {
      throw err;
    });
}

const userData = loadData();

export default { userData };
