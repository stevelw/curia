import { Injectable } from "@nestjs/common";
import { DeleteResult, Model, Connection } from "mongoose";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { PrivateUser } from "./schemas/user.schema";
import { CreateUserReqDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import {
  UpdateFavouritesReqDto,
  UpdateFavouritesResDto,
} from "./dto/update-favourites.dto";

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
    });
    return await createdUser.save();
  }

  async fetch(username: string): Promise<PrivateUser> {
    const user = await this.userModel.findOne<PrivateUser>({ username });
    return user ? user : Promise.reject(new Error("User not found"));
  }

  async updateFavourites(
    updateFavouritesReqDto: UpdateFavouritesReqDto,
    username: string,
  ): Promise<UpdateFavouritesResDto> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    let favourites = user.favourites ?? [];
    if (updateFavouritesReqDto.add?.length) {
      favourites = [
        ...new Set<string>([...favourites, ...updateFavouritesReqDto.add]),
      ];
    }
    user?.set("favourites", favourites);
    await user?.save();
    return { favourites };
  }

  async _deleteAll(): Promise<DeleteResult> {
    return await this.userModel.deleteMany();
  }
}
