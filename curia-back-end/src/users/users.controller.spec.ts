import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PrivateUser, UserSchema } from "./schemas/user.schema";
import { disconnect } from "mongoose";
import { PassportModule } from "@nestjs/passport";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING!),
        MongooseModule.forFeature([
          { name: PrivateUser.name, schema: UserSchema },
        ]),
        PassportModule.register({ defaultStrategy: "jwt" }),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => {
    await disconnect();
  });
});
