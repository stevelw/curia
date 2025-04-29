import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";
import { SigninReqDto } from "./dto/signin.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async signup(@Body() SignupReqDto: SignupReqDto): Promise<SignupResDto> {
    return await this.authService.signup(SignupReqDto);
  }

  @Post("/signin")
  @HttpCode(200)
  async signin(
    @Body() signinReqDto: SigninReqDto,
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.signin(signinReqDto);
    } catch (_err) {
      throw new UnauthorizedException();
    }
  }
}
