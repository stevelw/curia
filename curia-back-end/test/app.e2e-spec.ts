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
    it("returns a JWT access token, GIVEN unique username is provided", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({ username: "Unique", password: "password123" })
        .expect(201)
        .then((res) => {
          expect(res.body).toMatchObject({
            accessToken: expect.any(String),
          });
        });
    });
    it("returns an error, GIVEN provided username already exists", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({ username: "user1", password: "password123" })
        .expect(409);
    });
  });

  describe.skip("/signin (POST)", () => {
    it("returns a JWT access token, GIVEN valid login details", () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({ username: "user1", password: "password123" })
        .expect(200)
        .then((res) => {
          expect(res.body).toMatchObject({
            accessToken: expect.any(String),
          });
        });
    });
    it.skip("returns an error, GIVEN an incorrect password", () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({ username: "user1", password: "wrong-password" })
        .expect(401);
    });
    it.skip("returns an error, GIVEN a non-existent user", () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({ username: "not-a-user", password: "password123" })
        .expect(401);
    });
  });

  afterEach(async () => {
    await disconnect();
  });
});
