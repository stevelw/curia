import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SeederService } from "./seeder.service";
import { MongooseModule } from "@nestjs/mongoose";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
  ],
  providers: [Logger, SeederService],
})
export class SeederModule {}
