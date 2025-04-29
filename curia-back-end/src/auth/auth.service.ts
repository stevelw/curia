import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";
import { MongoServerError } from "mongodb";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "./interfaces/jwtpayload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signup(addUserDto: SignupReqDto): Promise<SignupResDto> {
    return this.usersService
      .create(addUserDto)
      .then((user) => {
        const payload: JwtPayload = { username: user.username };
        const accessToken = this.jwtService.sign(payload);
        return { user, accessToken };
      })
      .catch((err: MongoServerError) => {
        if (err.code === 11000) {
          throw new ConflictException("Username already exists.");
        }
        throw err;
      });
  }
}
