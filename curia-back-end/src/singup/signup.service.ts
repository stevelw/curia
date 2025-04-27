import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from "@nestjs/common";
import { Collection } from "mongodb";
import { SignupDto } from "./dto/singup-dto";
import User from "../users/user.interface";
import db from "../../db/connection";

@Injectable()
export class SignupService {
  usersCollection: Collection<User>;
  constructor() {
    this.usersCollection = db.collection("users");
  }

  async addUser(signupDto: SignupDto): Promise<{
    user: User;
    refreshToken: string;
  }> {
    const found = await this.usersCollection.findOne({
      username: signupDto.username,
    });
    if (found)
      throw new ConflictException(`A user with that username already exists.`);

    const newUserId = (await this.usersCollection.insertOne(signupDto))
      .insertedId;
    const newUser = await this.usersCollection.findOne({ _id: newUserId });

    if (!newUser) throw new InternalServerErrorException();

    return {
      user: newUser,
      refreshToken: "",
    };
  }
}
