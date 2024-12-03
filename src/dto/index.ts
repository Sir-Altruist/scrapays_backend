import { Field, InputType, PartialType } from "@nestjs/graphql"
import { IsEmail, IsString, MinLength } from "class-validator"

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