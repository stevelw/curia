import { createContext, Dispatch, SetStateAction } from "react";
import { LocalId } from "../apis/Artefact.interface";

export interface Session {
  accessToken: string;
  cachedFavourites: LocalId[];
}

export const SessionContext = createContext<
  [Session, Dispatch<SetStateAction<Session>>]
>([
  {
    accessToken: "",
    cachedFavourites: [],
  },
  () => {},
]);
