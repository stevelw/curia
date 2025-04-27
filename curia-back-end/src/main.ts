import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Curia Back End")
    .setDescription("The Curia Back End API description")
    .setVersion("1.0")
    .addTag("Curia")
    .build();
  const ducumentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, ducumentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
