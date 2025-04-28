import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

if (!process.env.DB_NAME) {
  throw new Error("DB_NAME needs to be set for this environment.");
}

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
  ],
  providers: [Logger],
})
export class SeederModule {}
