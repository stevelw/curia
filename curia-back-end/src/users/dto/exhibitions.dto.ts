import { ApiProperty } from "@nestjs/swagger";
import { GetExhibitionResDto } from "src/exhibitions/dto/get-exhibition.dto";

export class ExhibitionsResDto {
  @ApiProperty()
  exhibitions: GetExhibitionResDto[];
}
