import { Injectable } from "@nestjs/common";
import { DeleteResult, Model, Connection } from "mongoose";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async _deleteAll(): Promise<DeleteResult> {
    return await this.userModel.deleteMany();
  }
}
