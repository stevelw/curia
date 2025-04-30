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
import { FavouritesResDto } from "src/users/dto/favourites.dto";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let bearerToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const appContext = await NestFactory.createApplicationContext(SeederModule);
    await appContext.get(SeederService).seed();

    bearerToken = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({ username: "user1", password: "password123" })
      .then(({ body }) => {
        const { accessToken }: { accessToken: string } = body;
        return accessToken;
      });
  });

  describe("/signup (POST)", () => {
    it("201: returns a JWT access token, GIVEN unique username is provided", () => {
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
    it("409: returns an error, GIVEN provided username already exists", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({ username: "user1", password: "password123" })
        .expect(409);
    });
  });

  describe("/signin (POST)", () => {
    it("200: returns a JWT access token, GIVEN valid login details", () => {
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
    it("401: returns an error, GIVEN an incorrect password", () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({ username: "user1", password: "wrong-password" })
        .expect(401);
    });
    it("401: returns an error, GIVEN a non-existent user", () => {
      return request(app.getHttpServer())
        .post("/auth/signin")
        .send({ username: "not-a-user", password: "password123" })
        .expect(401);
    });
  });

  describe("/users/favourites", () => {
    describe("(GET)", () => {
      it("200: returns list of favourites, GIVEN the user is signed in", () => {
        return request(app.getHttpServer())
          .get("/users/favourites")
          .set("Authorization", "bearer " + bearerToken)
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              favourites: expect.any(Array),
            });
            const body: FavouritesResDto = res.body;
            expect(body.favourites).toEqual(["artefact1", "artefact2"]);
          });
      });
      it("401: GIVEN the user is not signed in", () => {
        return request(app.getHttpServer())
          .get("/users/favourites")
          .expect(401);
      });
    });
    describe("(PATCH)", () => {
      describe("add new favourite", () => {
        it("200: returns an updated list of favourites, GIVEN the user is signed in, WHEN a favourite is added", () => {
          return request(app.getHttpServer())
            .patch("/users/favourites")
            .set("Authorization", "bearer " + bearerToken)
            .send({ add: ["vaO76817"] })
            .expect(200)
            .then((res) => {
              expect(res.body).toMatchObject({
                favourites: expect.arrayContaining(["vaO76817"]),
              });
            })
            .then(() => {
              return request(app.getHttpServer())
                .patch("/users/favourites")
                .set("Authorization", "bearer " + bearerToken)
                .send({ add: ["vaO76818"] })
                .expect(200)
                .then((res) => {
                  expect(res.body).toMatchObject({
                    favourites: expect.arrayContaining([
                      "vaO76817",
                      "vaO76818",
                    ]),
                  });
                });
            });
        });
        it("401: GIVEN the user is not signed in", () => {
          return request(app.getHttpServer())
            .patch("/users/favourites")
            .send({ add: ["vaO76817"] })
            .expect(401);
        });
      });
    });
  });

  afterEach(async () => {
    await disconnect();
  });
});
