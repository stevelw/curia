import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "@dotenvx/dotenvx/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Curia")
    .setDescription(`API endpoints for Curia's backend`)
    .setVersion("1.0")
    .build();
  const swaggerDocument = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  const pathToSwaggerUI = "api";
  SwaggerModule.setup(pathToSwaggerUI, app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
