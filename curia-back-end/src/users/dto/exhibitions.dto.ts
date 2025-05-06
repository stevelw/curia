import { ApiProperty } from "@nestjs/swagger";
import { GetExhibitionResDto } from "../../exhibitions/dto/get-exhibition.dto";

export class ExhibitionsResDto {
  @ApiProperty()
  exhibitions: GetExhibitionResDto[];
}
