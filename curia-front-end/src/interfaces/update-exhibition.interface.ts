import { LocalId } from "../apis/Artefact.interface";
import { GetExhibitionResDto } from "./get-exhibitions.interface";

export interface UpdateExhibitionReqDto {
  add?: LocalId[];
  remove?: LocalId[];
}

export type UpdateExhibitionResDto = GetExhibitionResDto;
