import { ApiProperty } from "@nestjs/swagger";
import { FavouritesResDto } from "./favourites.dto";

export class UpdateFavouritesReqDto {
  @ApiProperty()
  add?: string[];
  remove?: string[];
}
export class UpdateFavouritesResDto extends FavouritesResDto {}
