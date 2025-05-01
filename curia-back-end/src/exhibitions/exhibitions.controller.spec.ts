import { Test, TestingModule } from "@nestjs/testing";
import { ExhibitionsController } from "./exhibitions.controller";
import { ExhibitionsService } from "./exhibitions.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Exhibition, ExhibitionSchema } from "./schemas/exhibition.schema";
import { disconnect } from "mongoose";
import { PrivateUser, UserSchema } from "../users/schemas/user.schema";
import { PassportModule } from "@nestjs/passport";

describe("ExhibitionsController", () => {
  let controller: ExhibitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING!),
        MongooseModule.forFeature([
          { name: Exhibition.name, schema: ExhibitionSchema },
          { name: PrivateUser.name, schema: UserSchema },
        ]),
        PassportModule.register({ defaultStrategy: "jwt" }),
      ],
      controllers: [ExhibitionsController],
      providers: [ExhibitionsService],
    }).compile();

    controller = module.get<ExhibitionsController>(ExhibitionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => {
    await disconnect();
  });
});
