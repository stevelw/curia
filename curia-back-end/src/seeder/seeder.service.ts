import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { users as usersDevData } from "../users/data/users.dev.data";
import { users as usersTestData } from "../users/data/users.test.data";
import { PrivateUser } from "src/users/schemas/user.schema";

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
  ) {}

  async seed(): Promise<void> {
    try {
      await this.users();
      this.logger.debug(`Seeded users`);
    } catch (err) {
      this.logger.error("Failed seeding users.");
      throw err;
    }
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
}
