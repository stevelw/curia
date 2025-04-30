import { ApiProperty } from "@nestjs/swagger";

export class UpdateFavouritesReqDto {
  @ApiProperty()
  add?: string[];
}
export class UpdateFavouritesResDto {
  @ApiProperty()
  favourites: string[];
}
