import { Module } from "@nestjs/common";
import { ExhibitionsService } from "./exhibitions.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Exhibition, ExhibitionSchema } from "./schemas/exhibition.schema";
import { PrivateUser, UserSchema } from "../users/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
      { name: PrivateUser.name, schema: UserSchema },
    ]),
  ],
  providers: [ExhibitionsService],
})
export class ExhibitionsModule {}
