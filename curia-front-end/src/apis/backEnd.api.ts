import axios, { AxiosError, CreateAxiosDefaults } from "axios";
import { SignupReqDto, SignupResDto } from "../interfaces/signup.interface";
import { SigninReqDto, SigninResDto } from "../interfaces/signin.interface";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (!process.env.EXPO_PUBLIC_BACK_END_URL) {
  throw new Error(
    "EXPO_PUBLIC_BACK_END_URL needs to be set for this environment.",
  );
}
const config: CreateAxiosDefaults = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  baseURL: process.env.EXPO_PUBLIC_BACK_END_URL,
};
const network = axios.create(config);

export function signup(username: string, password: string): Promise<string> {
  const body: SignupReqDto = { username, password };
  return network
    .post<SignupResDto>("/auth/signup", body)
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

export function signin(username: string, password: string): Promise<string> {
  const body: SigninReqDto = { username, password };
  return network
    .post<SigninResDto>("/auth/signin", body)
    .then(({ data }) => {
      return data.accessToken;
    })
    .catch(() => {
      throw new Error("Incorrect username or password");
    });
}
