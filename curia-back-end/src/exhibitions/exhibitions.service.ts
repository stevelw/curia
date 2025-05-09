import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Exhibition, ExhibitionDocument } from "./schemas/exhibition.schema";
import { Connection, DeleteResult, Model } from "mongoose";
import { LocalId } from "src/types";
import { PrivateUser, UserDocument } from "../users/schemas/user.schema";
import { ExhibitionId } from "./dto/get-exhibition.dto";
import {
  UpdateExhibitionReqDto,
  UpdateExhibitionResDto,
} from "./dto/update-exhibition.dto";

@Injectable()
export class ExhibitionsService {
  constructor(
    @InjectModel(Exhibition.name) private exhibitionModel: Model<Exhibition>,
    @InjectModel(PrivateUser.name) private userModel: Model<PrivateUser>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getExhibition(exhibitionId: ExhibitionId): Promise<ExhibitionDocument> {
    try {
      const exhibitionDocument =
        await this.exhibitionModel.findById<ExhibitionDocument>({
          _id: exhibitionId,
        });
      return exhibitionDocument
        ? exhibitionDocument
        : Promise.reject(new NotFoundException("Exhibition not found"));
    } catch (_error) {
      return Promise.reject(new BadRequestException("Invalid exhibition ID"));
    }
  }
  async getAllExhibitions(): Promise<ExhibitionDocument[]> {
    return this.exhibitionModel.find();
  }

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

  async updateExhibition(
    username: string,
    exhibitionId: ExhibitionId,
    updateExhibitionReqDto: UpdateExhibitionReqDto,
  ): Promise<UpdateExhibitionResDto> {
    const exhibitionDocument = await this.exhibitionModel.findOne({
      _id: exhibitionId,
    });
    if (!exhibitionDocument) {
      throw new NotFoundException("User not found");
    }
    const userDocument = await this.userModel.findOne({ username });
    if (!userDocument || !userDocument.exhibitions.includes(exhibitionId)) {
      throw new ForbiddenException("Not authorised");
    }
    if (updateExhibitionReqDto.add?.length) {
      exhibitionDocument.artefacts = [
        ...new Set<string>([
          ...exhibitionDocument.artefacts,
          ...updateExhibitionReqDto.add,
        ]),
      ];
    }
    if (updateExhibitionReqDto.remove?.length) {
      exhibitionDocument.artefacts = exhibitionDocument.artefacts.filter(
        (item) => !updateExhibitionReqDto.remove?.includes(item),
      );
    }
    await exhibitionDocument?.save();
    return exhibitionDocument;
  }

  async _deleteAll(): Promise<DeleteResult> {
    return await this.exhibitionModel.deleteMany();
  }
}
