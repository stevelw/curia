import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { seed } from "../db/seed";
import testData from "../db/data/test-data/data.index";
import { expect as expectAny } from "@jest/globals";
import { client } from "../db/connection";

let app: INestApplication<App>;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  await seed(testData);
});

afterAll(() => {
  void client.close();
});

describe("AppController (e2e)", () => {
  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("API documentation available at /api");
  });

  it("/users (POST)", () => {
    return request(app.getHttpServer())
      .post("/users")
      .send({ username: "johnsmith" })
      .expect(201)
      .expect({
        user: { username: "johnsmith" },
        refreshToken: expectAny.any(String),
      });
  });
});
