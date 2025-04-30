import { ApiProperty } from "@nestjs/swagger";

export class FavouritesResDto {
  @ApiProperty()
  favourites: string[];
}
