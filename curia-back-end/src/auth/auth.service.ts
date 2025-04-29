import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";
import { MongoServerError } from "mongodb";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  signup(addUserDto: SignupReqDto): Promise<SignupResDto> {
    return this.usersService
      .create(addUserDto)
      .then((newUser) => {
        return { user: newUser, refreshToken: "" };
      })
      .catch((err: MongoServerError) => {
        if (err.code === 11000) {
          throw new ConflictException("Username already exists.");
        }
        throw err;
      });
  }
}
