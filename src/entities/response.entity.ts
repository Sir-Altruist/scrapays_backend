import { ObjectType, Field, Int } from '@nestjs/graphql';
import { DetailsResult } from '../dto';
import { Book } from './book.entity';
import { User } from './auth.entity';
// import { JSONApiResponse } from 'auth0';

// @ObjectType('JSONApiResponse')
// export class JSONApiResponse<T = any> {
//   @Field({ defaultValue: 'success' })
//   status?: string;

//   @Field()
//   message: string;

//   @Field()
//   code: number;

//   @Field(() => DetailsResult, { nullable: true })
//   details?: typeof DetailsResult
// //   @Field(() => [Book], { nullable: true })
// //   details?: Book[];
//   constructor(init?: Partial<JSONApiResponse>) {
//     // If you pass an object like { status: 'success', message: 'Success', code: 201 }
//     // the constructor will set those values on the class instance.
//     Object.assign(this, init);
// }
// }

@ObjectType('BaseResponse')
export class BaseResponse {
  @Field(() => String, { defaultValue: 'success' })
  status: string;

  @Field(() => String)
  message: string;

  @Field(() => Int)
  code: number;

  constructor(partial: Partial<BaseResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class SuccessResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  token?: string;

  @Field(() => [Book], { nullable: true })
  books?: Book[];

  @Field()
  message: string;

  @Field(() => Int)
  code: number;

  @Field()
  status: string;
}


@ObjectType('JSONApiResponse')
export class JSONApiResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [Book], { nullable: true })
  books?: Book[];

  @Field(() => Book, { nullable: true })
  book?: Book

  @Field(() => String, { nullable: true })
  token?: string

  @Field(() => String, { nullable: true })
  otp?: string
  

  constructor(partial: Partial<JSONApiResponse>) {
    super(partial);  // Initialize BaseResponse
    Object.assign(this, partial);  // Copy additional properties to JSONApiResponse
  }
}