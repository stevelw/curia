import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SignupReqDto, SignupResDto } from "./dto/signup.dto";
import { MongoServerError } from "mongodb";
import { JwtService } from "@nestjs/jwt";
import JwtPayload from "./interfaces/jwtpayload.interface";
import { SigninReqDto, SigninResDto } from "./dto/signin.dto";
import * as bcrypt from "bcrypt";

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
        return { accessToken };
      })
      .catch((err: MongoServerError) => {
        if (err.code === 11000) {
          throw new ConflictException("Username already exists.");
        }
        throw err;
      });
  }

  signin(signinReqDto: SigninReqDto): Promise<SigninResDto> {
    const { username, password } = signinReqDto;

    return this.usersService
      .fetch(username)
      .then(({ hashedPassword }) => {
        return bcrypt.compare(password, hashedPassword);
      })
      .then((isValid) => {
        if (!isValid) throw UnauthorizedException;
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      })
      .catch(() => {
        throw UnauthorizedException;
      });
  }
}
