import axios, { AxiosError } from "axios";
import { SignupResDto } from "../../../curia-back-end/src/auth/dto/signup.dto";

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

export function signup(username: string, password: string): Promise<string> {
  return network
    .post<SignupResDto>("/auth/signup", { username, password })
    .then(({ data }) => {
      return data.accessToken;
    })
    .catch((err: AxiosError) => {
      if (err.status === 409) {
        throw new Error("User already exists");
      } else {
        throw new Error("Signup failed");
      }
    });
}
