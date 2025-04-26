import { ObjectId } from "mongodb";

export default class User {
  constructor(public id?: ObjectId) {}
}
