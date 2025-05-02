import { Test, TestingModule } from "@nestjs/testing";
import { ExhibitionsService } from "./exhibitions.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Exhibition, ExhibitionSchema } from "./schemas/exhibition.schema";
import { disconnect } from "mongoose";
import { PrivateUser, UserSchema } from "../users/schemas/user.schema";

describe("ExhibitionsService", () => {
  let service: ExhibitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING!),
        MongooseModule.forFeature([
          { name: Exhibition.name, schema: ExhibitionSchema },
          { name: PrivateUser.name, schema: UserSchema },
        ]),
      ],
      providers: [ExhibitionsService],
    }).compile();

    service = module.get<ExhibitionsService>(ExhibitionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await disconnect();
  });
});
