import { ApiProperty } from "@nestjs/swagger";
import { LocalId } from "src/types";
import { GetExhibitionResDto } from "./get-exhibition.dto";

export class CreateExhibitionReqDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  options?: {
    description?: string;
    artefacts?: LocalId[];
  };
}

export class CreateExhibitionResDto extends GetExhibitionResDto {}
