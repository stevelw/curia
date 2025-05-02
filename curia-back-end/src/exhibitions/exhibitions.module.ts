import { Module } from "@nestjs/common";
import { ExhibitionsService } from "./exhibitions.service";
import { ExhibitionsController } from "./exhibitions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Exhibition, ExhibitionSchema } from "./schemas/exhibition.schema";
import { PrivateUser, UserSchema } from "../users/schemas/user.schema";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
      { name: PrivateUser.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  providers: [ExhibitionsService],
  controllers: [ExhibitionsController],
})
export class ExhibitionsModule {}
