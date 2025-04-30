import { ApiProperty } from "@nestjs/swagger";

export class SigninReqDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class SigninResDto {
  accessToken: string;
}
