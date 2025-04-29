import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup(@Body() SignupReqDto: SignupReqDto): Promise<SignupResDto> {
    return this.authService.signup(SignupReqDto);
  }
}
