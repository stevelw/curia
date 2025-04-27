/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { seed } from "../db/seed";
import testData from "../db/data/test-data/data.index";
import { client } from "../db/connection";
import User from "src/users/user.interface";

let app: INestApplication<App>;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  const userData: User[] = await testData.userData;
  await seed({ userData });
});

afterAll(() => {
  void client.close();
});

describe("root", () => {
  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("API documentation available at /api");
  });
});

describe("/signup", () => {
  it("(POST) - unique username", () => {
    return request(app.getHttpServer())
      .post("/signup")
      .send({ username: "johnsmith" })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty("user");
        const user = res.body.user;
        expect(user).toHaveProperty("_id");
        expect(typeof user._id).toBe("string");
        expect(res.body.user).toMatchObject({
          username: "johnsmith",
        });
        expect(res.body).toHaveProperty("refreshToken");
        expect(typeof res.body.refreshToken).toBe("string");
      });
  });

  it("(POST) - existing username", () => {
    return request(app.getHttpServer())
      .post("/signup")
      .send({ username: "Steve" })
      .expect(409);
  });
});
