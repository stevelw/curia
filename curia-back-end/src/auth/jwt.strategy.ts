import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrivateUser } from "../users/schemas/user.schema";
import JwtPayload from "./interfaces/jwtpayload.interface";

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY needs to be set for this environment.");
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(PrivateUser.name)
    private userModel: Model<PrivateUser>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<PrivateUser> {
    const { username } = payload;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
