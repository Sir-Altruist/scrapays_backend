import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), 
  JwtModule.register({
    secret: process.env.TOKEN_SECRET,
    signOptions: { expiresIn: "60m"}
  })],
  providers: [BookService, BookResolver, JwtService, AuthGuard]
})
export class BookModule {}
