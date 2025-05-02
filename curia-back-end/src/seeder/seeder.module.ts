import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SeederService } from "./seeder.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ExhibitionsModule } from "../exhibitions/exhibitions.module";
import { ExhibitionsService } from "../exhibitions/exhibitions.service";
import {
  Exhibition,
  ExhibitionSchema,
} from "../exhibitions/schemas/exhibition.schema";
import { PrivateUser, UserSchema } from "../users/schemas/user.schema";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

@Module({
  imports: [
    UsersModule,
    ExhibitionsModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([
      { name: Exhibition.name, schema: ExhibitionSchema },
      { name: PrivateUser.name, schema: UserSchema },
    ]),
  ],
  providers: [Logger, SeederService, ExhibitionsService],
})
export class SeederModule {}
