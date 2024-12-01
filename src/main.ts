import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './utils/entity.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphQLExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
