import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeder/seeder.module";
import { Logger } from "@nestjs/common";
import { SeederService } from "./seeder/seeder.service";

function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(SeederService);

      seeder
        .seed()
        .then(() => {
          logger.debug("Seeded complete");
        })
        .catch((err) => {
          logger.error("Seeding failed");
          throw err;
        })
        .finally(() => void appContext.close());
    })
    .catch((err) => {
      throw err;
    });
}
bootstrap();
