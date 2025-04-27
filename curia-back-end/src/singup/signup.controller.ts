import { Body, Controller, Post } from "@nestjs/common";
import { SignupService } from "./signup.service";
import { SignupDto } from "./dto/singup-dto";
import User from "src/users/user.interface";

@Controller("signup")
export class SignupController {
  constructor(private signupService: SignupService) {}

  @Post()
  addUser(@Body() signupDto: SignupDto): Promise<{
    user: User;
    refreshToken: string;
  }> {
    return this.signupService.addUser(signupDto);
  }
}
