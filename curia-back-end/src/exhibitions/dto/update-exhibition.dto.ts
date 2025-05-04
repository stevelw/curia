import { ApiProperty } from "@nestjs/swagger";
import { GetExhibitionResDto } from "./get-exhibition.dto";

export class UpdateExhibitionReqDto {
  @ApiProperty()
  add?: string[];
  remove?: string[];
}
export class UpdateExhibitionResDto extends GetExhibitionResDto {}
