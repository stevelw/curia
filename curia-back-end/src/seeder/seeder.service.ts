import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { users as usersDevData } from "../users/data/users.dev.data";
import { exhibitions as exhibitionsDevData } from "..//exhibitions/data/exhibitions.dev.data";
import { users as usersTestData } from "../users/data/users.test.data";
import { exhibitions as exhibitionsTestData } from "..//exhibitions/data/exhibitions.test.data";
import { PrivateUser } from "src/users/schemas/user.schema";
import { UpdateFavouritesResDto } from "src/users/dto/update-favourites.dto";
import { CreateExhibitionResDto } from "src/exhibitions/dto/create-exhibition.dto";
import { ExhibitionsService } from "..//exhibitions/exhibitions.service";

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly exhibitionsService: ExhibitionsService,
  ) {}

  async seed(): Promise<{ validExhibition: CreateExhibitionResDto }> {
    let validExhibition: CreateExhibitionResDto;
    try {
      await this.users();
      await this.favourites();
      this.logger.debug(`Seeded users`);
    } catch (err) {
      this.logger.error("Failed seeding users.");
      throw err;
    }
    try {
      const seededExhibitions = await this.exhibitions();
      validExhibition = seededExhibitions.find(
        ({ title }) => title === "exhibition1",
      )!;
      this.logger.debug(`Seeded exhibitions`);
    } catch (err) {
      this.logger.error("Failed seeding exhibitions.");
      throw err;
    }
    return { validExhibition };
  }

  users(): Promise<PrivateUser[]> {
    const users =
      process.env.NODE_ENV === "test" ? usersTestData : usersDevData;
    return this.usersService
      ._deleteAll()
      .then((result) => {
        if (!result.acknowledged) throw new Error("Delete failed");
        return Promise.all(users.map((user) => this.usersService.create(user)));
      })
      .catch((err) => {
        throw err;
      });
  }

  favourites(): Promise<UpdateFavouritesResDto[]> {
    const users =
      process.env.NODE_ENV === "test" ? usersTestData : usersDevData;
    return Promise.all(
      users.map((user) =>
        this.usersService.updateFavourites(
          { add: user.favourites },
          user.username,
        ),
      ),
    ).catch((err) => {
      throw err;
    });
  }

  async exhibitions(): Promise<CreateExhibitionResDto[]> {
    const seededExhibitions: CreateExhibitionResDto[] = [];
    const exhibitions =
      process.env.NODE_ENV === "test"
        ? exhibitionsTestData
        : exhibitionsDevData;
    const result = await this.exhibitionsService._deleteAll();
    if (!result.acknowledged) throw new Error("Delete failed");
    for (const seed of exhibitions) {
      const {
        username,
        exhibition: { title, options },
      } = seed;
      seededExhibitions.push(
        await this.exhibitionsService.create(username, title, options),
      );
    }
    return seededExhibitions;
  }
}
