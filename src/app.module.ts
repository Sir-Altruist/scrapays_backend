import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    playground: {
      settings: {
        "schema.polling.enable": false // This prevents suggestion pop-ups on playground
      }
    },
    context: ({ req }) => ({ req }),
    formatError: (error: GraphQLError) => {
      const { message, extensions } = error;
      console.log('code: ', extensions?.code)
      return {
        message,
        status: extensions?.status,
        code: extensions?.code,
        __typename: extensions?.__typename,
      };
    }
  }), 
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: join(process.cwd(), 'src/database/dev.db'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE === 'production' ? false : true,
    migrations: [join(process.cwd(), 'src/databse/migrations')],
    migrationsRun: true,
    migrationsTableName: 'migrations'
  }),
  AuthModule,
  JwtModule.register({
    global: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    signOptions: { expiresIn: "60m"}
  }), 
  BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
