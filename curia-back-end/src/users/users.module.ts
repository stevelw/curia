import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrivateUser, UserSchema } from "./schemas/user.schema";
import { AuthModule } from "../auth/auth.module";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PrivateUser.name, schema: UserSchema }]),
    AuthModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
