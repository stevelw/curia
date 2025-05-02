import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { LocalId } from "src/types";

export type ExhibitionId = Types.ObjectId;

export class CreateExhibitionReqDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  options?: {
    description?: string;
    artefacts?: LocalId[];
  };
}

export class CreateExhibitionResDto {
  @ApiProperty()
  _id: ExhibitionId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  artefacts: LocalId[];
}
