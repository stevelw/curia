import { Test, TestingModule } from "@nestjs/testing";
import { SeederService } from "./seeder.service";
import { Logger } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { disconnect } from "mongoose";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

describe("SeederService", () => {
  let service: SeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING!),
      ],
      providers: [Logger, SeederService],
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await disconnect();
  });
});
