import { createContext, Dispatch, SetStateAction } from "react";
import { LocalId } from "../apis/Artefact.interface";

export interface Session {
  accessToken: string;
  cachedFavourites: LocalId[] | null;
}

export const SessionContext = createContext<
  [Session, Dispatch<SetStateAction<Session>>]
>([
  {
    accessToken: "",
    cachedFavourites: null,
  },
  () => {},
]);
