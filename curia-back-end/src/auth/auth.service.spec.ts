import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schemas/user.schema";
import { disconnect } from "mongoose";
import { UsersService } from "../users/users.service";

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING needs to be set for this environment.",
  );
}

describe("SignupService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING!),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await disconnect();
  });
});
