import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrivateUser, UserSchema } from "./schemas/user.schema";
import { AuthModule } from "../auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { ExhibitionsService } from "../exhibitions/exhibitions.service";
import {
  Exhibition,
  ExhibitionSchema,
} from "../exhibitions/schemas/exhibition.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PrivateUser.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
    ]),
    AuthModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ExhibitionsService],
  exports: [UsersService],
})
export class UsersModule {}
