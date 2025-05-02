import { LocalId } from "../apis/Artefact.interface";
import { GetExhibitionResDto } from "./get-exhibitions.interface";

export interface CreateExhibitionReqDto {
  title: string;
  options?: {
    description?: string;
    artefacts?: LocalId[];
  };
}

export type CreateExhibitionResDto = GetExhibitionResDto;
