import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { LocalId } from "src/types";

export type ExhibitionId = Types.ObjectId;

export class GetExhibitionResDto {
  @ApiProperty()
  _id: ExhibitionId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  artefacts: LocalId[];
}
