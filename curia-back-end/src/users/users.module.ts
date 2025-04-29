import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrivateUser, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PrivateUser.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
