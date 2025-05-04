import { LocalId } from "../apis/Artefact.interface";

export type ExhibitionId = string;

export interface GetExhibitionResDto {
  _id: ExhibitionId;
  title: string;
  description?: string;
  artefacts?: LocalId[];
}
