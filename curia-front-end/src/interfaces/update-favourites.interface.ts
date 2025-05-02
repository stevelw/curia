export interface UpdateFavouritesReqDto {
  add?: string[];
  remove?: string[];
}

export interface UpdateFavouritesResDto {
  favourites: string[];
}
