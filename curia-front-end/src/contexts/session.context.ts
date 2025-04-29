import { createContext, Dispatch, SetStateAction } from "react";

export interface Session {
  accessToken: string;
}

export const SessionContext = createContext<
  [Session, Dispatch<SetStateAction<Session>>]
>([
  {
    accessToken: "",
  },
  () => {},
]);
