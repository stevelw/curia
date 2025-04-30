import axios from "axios";
import { SigninResDto } from "../../../curia-back-end/src/auth/dto/signin.dto";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (!process.env.EXPO_PUBLIC_BACK_END_URL) {
  throw new Error(
    "EXPO_PUBLIC_BACK_END_URL needs to be set for this environment.",
  );
}

const network = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  baseURL: process.env.EXPO_PUBLIC_BACK_END_URL,
});

export function signin(username: string, password: string): Promise<string> {
  return network
    .post<SigninResDto>("/auth/signin", { username, password })
    .then(({ data }) => {
      return data.accessToken;
    })
    .catch(() => {
      throw new Error("Incorrect username or password");
    });
}
