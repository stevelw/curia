import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";
import { SigninReqDto, SigninResDto } from "./dto/signin.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "Returns a JWT access token",
  })
  @ApiResponse({
    status: 409,
    description: "User already exists",
  })
  async signup(@Body() SignupReqDto: SignupReqDto): Promise<SignupResDto> {
    return await this.authService.signup(SignupReqDto);
  }

  @Post("/signin")
  @ApiOperation({ summary: "Sign in" })
  @ApiResponse({
    status: 200,
    description: "Returns a JWT access token",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorised",
  })
  @HttpCode(200)
  async signin(@Body() signinReqDto: SigninReqDto): Promise<SigninResDto> {
    try {
      return await this.authService.signin(signinReqDto);
    } catch (_err) {
      throw new UnauthorizedException();
    }
  }
}
