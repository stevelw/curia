import { ApiProperty } from "@nestjs/swagger";
import { CreateUserReqDto } from "../../users/dto/create-user.dto";

export class SignupReqDto extends CreateUserReqDto {}

export class SignupResDto {
  @ApiProperty()
  accessToken: string;
}
