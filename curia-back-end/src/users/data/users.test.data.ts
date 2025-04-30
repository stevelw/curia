import { CreateUserReqDto } from "../dto/create-user.dto";

export class SeedUserDto extends CreateUserReqDto {
  favourites: string[];
}

export const users: SeedUserDto[] = [
  {
    username: "user1",
    password: "password123",
    favourites: ["artefact1", "artefact2"],
  },
  { username: "user2", password: "password123", favourites: [] },
];
