import { createContext, Dispatch, SetStateAction } from "react";
import { LocalId } from "../apis/Artefact.interface";
import { GetExhibitionResDto } from "../interfaces/get-exhibition.interface";

export interface Session {
  accessToken: string;
  cachedFavourites: LocalId[] | null;
  cachedExhibitions: GetExhibitionResDto[] | null;
}

export const SessionContext = createContext<
  [Session, Dispatch<SetStateAction<Session>>]
>([
  {
    accessToken: "",
    cachedFavourites: [],
    cachedExhibitions: [],
  },
  () => {},
]);
