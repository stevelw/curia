import { LocalId } from "../apis/Artefact.interface";
import { GetExhibitionResDto } from "./get-exhibition.interface";

export interface UpdateExhibitionReqDto {
  add?: LocalId[];
  remove?: LocalId[];
}

export type UpdateExhibitionResDto = GetExhibitionResDto;
