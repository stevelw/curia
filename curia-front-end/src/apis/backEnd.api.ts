import axios, { AxiosError, CreateAxiosDefaults } from "axios";
import { SignupReqDto, SignupResDto } from "../interfaces/signup.interface";
import { SigninReqDto, SigninResDto } from "../interfaces/signin.interface";
import { LocalId } from "./Artefact.interface";
import {
  UpdateFavouritesReqDto,
  UpdateFavouritesResDto,
} from "../interfaces/update-favourites.interface";
import { FavouritesResDto } from "../../../curia-back-end/src/users/dto/favourites.dto";
import {
  CreateExhibitionReqDto,
  CreateExhibitionResDto,
} from "../interfaces/create-exhibition.interface";
import {
  ExhibitionId,
  GetExhibitionResDto,
} from "../interfaces/get-exhibitions.interface";

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

export function fetchFavourites(
  accessToken: string,
): Promise<{ favourites: LocalId[] }> {
  return network
    .get<FavouritesResDto>("/users/favourites", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      throw new Error("Incorrect username or password");
    });
}

export function addToFavourites(
  accessToken: string,
  artefactId: LocalId,
): Promise<LocalId[]> {
  const body: UpdateFavouritesReqDto = { add: [artefactId] };
  return network
    .patch<UpdateFavouritesResDto>("/users/favourites", body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then(({ data }) => {
      return data.favourites;
    })
    .catch(() => {
      throw new Error("Incorrect username or password");
    });
}

export function createExhibition(
  accessToken: string,
  title: string,
  description?: string,
): Promise<CreateExhibitionResDto> {
  const body: CreateExhibitionReqDto = { title, options: { description } };
  return network
    .post<CreateExhibitionResDto>("/exhibitions", body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch(() => {
      throw new Error(
        "Error creating exhibition. Check your internet connection.",
      );
    });
}

export function fetchExhibition(
  exhibitionId: ExhibitionId,
): Promise<GetExhibitionResDto> {
  return network
    .get<GetExhibitionResDto>(`/exhibitions/${exhibitionId}`, {})
    .then(({ data }) => {
      return data;
    })
    .catch(() => {
      throw new Error("Incorrect username or password");
    });
}
