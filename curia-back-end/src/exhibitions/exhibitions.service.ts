import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Exhibition, ExhibitionDocument } from "./schemas/exhibition.schema";
import { Connection, DeleteResult, Model } from "mongoose";
import { LocalId } from "src/types";
import { PrivateUser, UserDocument } from "../users/schemas/user.schema";

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectModel(Exhibition.name) private exhibitionModel: Model<Exhibition>,
    @InjectModel(PrivateUser.name) private userModel: Model<PrivateUser>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    username: string,
    title: string,
    options?: {
      description?: string;
      artefacts?: LocalId[];
    },
  ): Promise<ExhibitionDocument> {
    const exhibitionDocument = new this.exhibitionModel({
      title,
      description: options?.description,
      artefacts: options?.artefacts,
    });
    await exhibitionDocument.save();
    const userDocument = await this.userModel.findOne<UserDocument>({
      username,
    });
    userDocument?.set("exhibitions", [
      ...(userDocument.exhibitions ?? []),
      exhibitionDocument._id,
    ]);
    await userDocument?.save();
    return exhibitionDocument;
  }

  async _deleteAll(): Promise<DeleteResult> {
    return await this.exhibitionModel.deleteMany();
  }
}
