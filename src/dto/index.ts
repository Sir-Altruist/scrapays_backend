import { createUnionType, Field, InputType, PartialType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Book } from "../entities/book.entity"
import { User } from "../entities/auth.entity"
import { 
    NotFoundError,
    ServerError, 
    ValidationError 
} from "../entities/exceptions.entity"
import { JSONApiResponse } from "src/entities/response.entity"

@InputType()
export class CreateInput {
    @IsString()
    @Field()
    @IsString({ message: "Name must be a string"})
    @MinLength(3, { message: "Name must be at least 3 characters long"})
    name: string

    @IsString()
    @Field()
    @IsString({ message: "Description must be a string"})
    @MinLength(10, { message: "Description must be at least 10 characters long"})
    description: string
}

@InputType()
export class SignUpDto {
    @IsEmail()
    @Field()
    email: string;

    @Field()
    @MinLength(3, { message: "Username must be at least 3 characters long"})
    name: string;

    connection: string;
}

@InputType()
export class SignInDto {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    code: string
}

@InputType()
export class OtpDto {
    @Field()
    @IsEmail()
    email: string;

    send?: 'code' | 'link'
}

@InputType()
export class UpdateInput extends PartialType(CreateInput) {}

// const JSONApiResponse = objectType({
//     name: 'JSONApiResponse',
//     definition(t) {
//         t.string('status');
//         t.string('message');
//         t.int('code');
//     }
// })


export const ResponseResult = createUnionType({
    name: 'ResponseResult',
    types: () => [
        Book, 
        User, 
        // BooksArray,
        // SuccessResponse, 
        NotFoundError, 
        ValidationError, 
        ServerError,
        JSONApiResponse
    ],
    /** Working */
    // types: () => [Book, User, NotFoundError, ValidationError, ServerError],
    resolveType(value) {
        if (value instanceof JSONApiResponse) {
            return JSONApiResponse;
        }

        if(value instanceof Book){
            return Book;
        }

        // if(value instanceof BooksArray){
        //     return BooksArray;
        // }

        if(value instanceof User){
            return User;
        }


        // if(value instanceof SuccessResponse){
        //     return SuccessResponse
        // }


        console.log('error: ', value?.constructor?.name)
        console.log('error2: ', value)
        // console.log('value: ', value?.constructor?.name)
        /** Working */
        return value?.constructor?.name;
    }
})


export const DetailsResult = createUnionType({
    name: 'DetailsResult',
    types: () => [User, Book] as const,
    resolveType(value) {
      if (value instanceof User) {
        return User;
      }
      if (value instanceof Book) {
        return Book;
      }

    //   if (Array.isArray(value) && value.every(item => item instanceof Book)) {
    //     return 'BooksArray'; // Return BooksArray if it's an array of Books
    //   }

    //   if(value instanceof BooksArray){
    //     return BooksArray
    //   }

        console.log('value: ', value?.constructor?.name)
        return value?.constructor?.name;
    },
  });
  