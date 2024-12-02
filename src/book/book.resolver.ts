import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { CreateInput, UpdateInput, ResponseResult } from '../dto';
import { HttpStatus, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidateInput } from '../interceptors/validation';
import { ValidationFailedException } from 'src/utils/custom-exceptions.ts';
import { ErrorWrapper, handleError } from 'src/utils/exceptions';
import { AuthGuard } from 'src/auth/auth-token';
import { SuccessResponse } from 'src/entities/response.entity';
import { GraphQLError } from 'graphql';
import { JwtAuthGuard } from 'src/middlewares/authGuard';


@Resolver(SuccessResponse)
@UseGuards(JwtAuthGuard)
export class BookResolver {
    constructor(private readonly bookService: BookService){}

    @Query(() => SuccessResponse)
    async findBooks(): Promise<SuccessResponse>{
        try {
            const books = await this.bookService.findAll()
            return {
                books,
                message: "Successfully retrieved all books",
                status: "success",
                code: HttpStatus.OK
            }
        } catch (error) {
            Logger.error(`Error retrieving all books: ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error;
            }
            throw ErrorWrapper("Something went wrong! Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Mutation(() => ResponseResult)
    @UseInterceptors(new ValidateInput(CreateInput))
    async createBook(@Args('createInput') createInput: CreateInput): Promise<typeof ResponseResult>{
        try {
            return await this.bookService.create(createInput)
        } catch (error) {
            Logger.error(`Error uploading book: ${error?.message}`)
            return handleError(error)
        }
    }

    @Query(() => ResponseResult)
    async findBook(@Args('id', { type: () => Int}) id: number): Promise<typeof ResponseResult> {
        try {

            if(typeof id !== "number") throw new ValidationFailedException('Invalid Id type');

            if (id <= 0) throw new ValidationFailedException('Id must be a positive number');

            return await this.bookService.findOne(id)
        } catch (error) {
            Logger.error(`Error retrieving book (${id}): ${error?.message}`)
            return handleError(error)
        }
    }
    
    @Mutation(() => ResponseResult)
    async updateBook(@Args('id', { type: () => Int}) id: number, @Args('updateInput') updateInput: UpdateInput): Promise<typeof ResponseResult>{
        try {

            if(typeof id !== "number") throw new ValidationFailedException('Invalid Id type');

            if (id <= 0) throw new ValidationFailedException('Id must be a positive number');

            return await this.bookService.update(id, updateInput)
        } catch (error) {
            Logger.error(`Error updating book (${id}): ${error?.message}`)
            return handleError(error)
        }
    }

    @Query(() => ResponseResult)
    async deleteBook(@Args('id', { type: () => Int}) id: number): Promise<typeof ResponseResult>{
        try { 

            if(typeof id !== "number") throw new ValidationFailedException('Invalid Id type');

            if (id <= 0) throw new ValidationFailedException('Id must be a positive number'); 

            return await this.bookService.remove(id)
        } catch (error) {
            Logger.error(`Error updating book (${id}): ${error?.message}`)
            return handleError(error)
        }
    }
}
