import db from "./connection.js";

export function seed({ userData }) {
  return db
    .dropCollection("users")
    .then(() => {
      return db.collection("users").insertMany(userData);
    })
    .catch((err) => {
      throw err;
    });
}
