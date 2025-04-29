import { Injectable } from "@nestjs/common";
import { DeleteResult, Model, Connection } from "mongoose";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { PrivateUser } from "./schemas/user.schema";
import { CreateUserReqDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(PrivateUser.name) private userModel: Model<PrivateUser>,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async create({ username, password }: CreateUserReqDto): Promise<PrivateUser> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = new this.userModel({
      username,
      hashedPassword,
      salt,
    });
    return await createdUser.save();
  }

  async _deleteAll(): Promise<DeleteResult> {
    return await this.userModel.deleteMany();
  }
}
