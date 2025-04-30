import { ApiProperty } from "@nestjs/swagger";

export class CreateUserReqDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
