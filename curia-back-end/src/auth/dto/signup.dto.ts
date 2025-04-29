import { CreateUserReqDto } from "../../users/dto/create-user.dto";

export class SignupReqDto extends CreateUserReqDto {}

export class SignupResDto {
  accessToken: string;
}
