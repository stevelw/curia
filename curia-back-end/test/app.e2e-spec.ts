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
import { CreateExhibitionResDto } from "../src/exhibitions/dto/create-exhibition.dto";

let validExhibition: CreateExhibitionResDto;

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let normalUserBearerToken: string;
  let otherUserBearerToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const seedingResults = await appContext.get(SeederService).seed();

    validExhibition = seedingResults.validExhibition;

    normalUserBearerToken = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({ username: "user1", password: "password123" })
      .then(({ body }) => {
        const { accessToken }: { accessToken: string } = body;
        return accessToken;
      });
    otherUserBearerToken = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({ username: "user2", password: "password123" })
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
          .set("Authorization", "bearer " + normalUserBearerToken)
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
            .set("Authorization", "bearer " + normalUserBearerToken)
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
                .set("Authorization", "bearer " + normalUserBearerToken)
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

  describe("/exhibitions/", () => {
    describe("(GET)", () => {
      it("200: returns details of exhibitions", () => {
        return request(app.getHttpServer())
          .get(`/exhibitions/`)
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            for (const element of body) {
              expect(element).toMatchObject({
                title: expect.any(String),
                description: expect.any(String),
                artefacts: expect.any(Array),
              });
            }
          });
      });
    });
    describe("(POST)", () => {
      it("201: returns new exhibition, GIVEN user is logged in", () => {
        return request(app.getHttpServer())
          .post(`/exhibitions/`)
          .send({
            title: "A journey through time",
            options: { description: "A great exhibition" },
          })
          .set("Authorization", "bearer " + normalUserBearerToken)
          .expect(201)
          .then(({ body }) => {
            expect(body).toMatchObject({
              _id: expect.any(String),
              title: "A journey through time",
              description: "A great exhibition",
            });
          });
      });
      it("401: GIVEN user isn't logged in", () => {
        return request(app.getHttpServer())
          .post(`/exhibitions/`)
          .send({
            title: "A journey through time",
            description: "A great exhibition",
          })
          .expect(401);
      });
    });
  });

  describe("/exhibitions/:exhibitionId", () => {
    describe("(GET)", () => {
      it("200: returns details of exhibition, GIVEN a valid exhibitionId", () => {
        return request(app.getHttpServer())
          .get(`/exhibitions/${validExhibition._id.toString()}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toMatchObject({
              title: expect.any(String),
              description: expect.any(String),
              artefacts: expect.any(Array),
            });
            const { title, description, artefacts } =
              body as CreateExhibitionResDto;
            expect(title).toEqual(validExhibition.title);
            expect(description).toEqual(validExhibition.description);
            expect(artefacts).toEqual(validExhibition.artefacts);
          });
      });
      it("404: GIVEN an invalid exhibitionId", () => {
        return request(app.getHttpServer())
          .get("/users/favourites")
          .expect(401);
      });
    });
    describe("(PATCH)", () => {
      describe("add artefact to exhibition", () => {
        it("200: returns an updated exhibition, GIVEN the user is signed in, WHEN an artefact is added", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .set("Authorization", "bearer " + normalUserBearerToken)
            .send({ add: ["vaO76817"] })
            .expect(200)
            .then((res) => {
              expect(res.body).toMatchObject({
                artefacts: expect.arrayContaining(["vaO76817"]),
              });
            })
            .then(() => {
              return request(app.getHttpServer())
                .patch(`/exhibitions/${validExhibition._id.toString()}`)
                .set("Authorization", "bearer " + normalUserBearerToken)
                .send({ add: ["vaO76818"] })
                .expect(200)
                .then((res) => {
                  expect(res.body).toMatchObject({
                    artefacts: expect.arrayContaining(["vaO76817", "vaO76818"]),
                  });
                });
            });
        });
        it("403 GIVEN a user without permissions is signed in", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .set("Authorization", "bearer " + otherUserBearerToken)
            .send({ add: ["vaO76817"] })
            .expect(403);
        });
        it("401: GIVEN the user is not signed in", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .send({ add: ["vaO76817"] })
            .expect(401);
        });
      });

      describe("remove artefact from exhibition", () => {
        it("200: returns an updated exhibition, GIVEN the user is signed in, WHEN an existing artefact is removed", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .set("Authorization", "bearer " + normalUserBearerToken)
            .send({ add: ["vaO76817"] })
            .expect(200)
            .then((res) => {
              expect(res.body).toMatchObject({
                artefacts: expect.arrayContaining(["vaO76817"]),
              });
            })
            .then(() => {
              return request(app.getHttpServer())
                .patch(`/exhibitions/${validExhibition._id.toString()}`)
                .set("Authorization", "bearer " + normalUserBearerToken)
                .send({ remove: ["vaO76817"] })
                .expect(200)
                .then((res) => {
                  expect(res.body).toMatchObject({
                    artefacts: expect.not.arrayContaining(["vaO76817"]),
                  });
                });
            });
        });
        it("200: returns an updated exhibition, GIVEN the user is signed in, WHEN an artefact is removed that doesn't exist", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .set("Authorization", "bearer " + normalUserBearerToken)
            .send({ remove: ["vaO76817"] })
            .expect(200)
            .then((res) => {
              expect(res.body).toMatchObject({
                artefacts: expect.not.arrayContaining(["vaO76817"]),
              });
            })
            .then(() => {
              return request(app.getHttpServer())
                .patch(`/exhibitions/${validExhibition._id.toString()}`)
                .set("Authorization", "bearer " + normalUserBearerToken)
                .send({ remove: ["vaO76817"] })
                .expect(200)
                .then((res) => {
                  expect(res.body).toMatchObject({
                    artefacts: expect.not.arrayContaining(["vaO76817"]),
                  });
                });
            });
        });
        it("403 GIVEN a user without permissions is signed in", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .set("Authorization", "bearer " + otherUserBearerToken)
            .send({ remove: ["vaO76817"] })
            .expect(403);
        });
        it("401: GIVEN the user is not signed in", () => {
          return request(app.getHttpServer())
            .patch(`/exhibitions/${validExhibition._id.toString()}`)
            .send({ remove: ["vaO76817"] })
            .expect(401);
        });
      });
    });
  });

  afterEach(async () => {
    await disconnect();
  });
});
