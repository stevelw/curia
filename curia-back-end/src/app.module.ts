import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { SeederModule } from "./seeder/seeder.module";
import { AuthModule } from "./auth/auth.module";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    UsersModule,
    SeederModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
