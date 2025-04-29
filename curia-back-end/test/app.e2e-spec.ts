/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { disconnect } from "mongoose";
import { NestFactory } from "@nestjs/core";
import { SeederModule } from "../src/seeder/seeder.module";
import { SeederService } from "../src/seeder/seeder.service";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const appContext = await NestFactory.createApplicationContext(SeederModule);
    try {
      await appContext.get(SeederService).seed();
    } finally {
      await appContext.close();
    }
  });

  describe("/signup (POST)", () => {
    it("returns a JWT refresh token, GIVEN unique username is provided", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({ username: "Unique" })
        .expect(201)
        .then((res) => {
          expect(res.body).toMatchObject({
            user: { username: expect.any(String) },
            refreshToken: expect.any(String),
            accessToken: expect.any(String),
          });
        });
    });
    it("returns an error, GIVEN provided username already exists", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({ username: "user1" })
        .expect(409);
    });
  });

  afterEach(async () => {
    await disconnect();
  });
});
