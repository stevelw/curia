import { ApiProperty } from "@nestjs/swagger";
import { LocalId } from "src/types";

export class FavouritesResDto {
  @ApiProperty()
  favourites: LocalId[];
}
