import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from './book.entity';
import { User } from './auth.entity';

@ObjectType()
export class SuccessResponse {
  @Field(() => User)
  user?: User;

  @Field()
  token?: string;

  @Field(() => [Book])
  books?: Book[];

  @Field(() => Book)
  book?: Book;

  @Field()
  message: string;

  @Field(() => Int)
  code: number;

  @Field()
  status: string;
}