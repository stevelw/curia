import { CreateUserReqDto } from "../../users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";

export class SignupReqDto extends CreateUserReqDto {}

export class SignupResDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
