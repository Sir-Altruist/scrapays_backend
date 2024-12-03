import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { CreateInput, UpdateInput } from '../dto';
import { HttpStatus, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidateInput } from '../interceptors/validation';
import * as Tools from '../utils/tool'
import { AuthGuard } from '../auth/auth.guard';
import { SuccessResponse } from 'src/entities/response.entity';
import { GraphQLError } from 'graphql';


@Resolver(SuccessResponse)
@UseGuards(AuthGuard)
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
            throw Tools.ErrorWrapper("Something went wrong! Please retry", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Mutation(() => SuccessResponse)
    @UseInterceptors(new ValidateInput(CreateInput))
    async createBook(@Args('createInput') createInput: CreateInput): Promise<SuccessResponse>{
        try {
            // return await this.bookService.create(createInput)
            const book = await this.bookService.create(createInput)
            return {
                book,
                message: "Successfully uploaded book",
                status: "success",
                code: HttpStatus.CREATED
            }
        } catch (error) {
            Logger.error(`Error creating new book: ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error
            }
            throw Tools.ErrorWrapper("Something went wrong. Please try again", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Query(() => SuccessResponse)
    async findBook(@Args('id', { type: () => Int}) id: number): Promise<SuccessResponse> {
        try {
            Tools.checkPositiveId(id)
            const book =  await this.bookService.findOne(id)
            return {
                book,
                message: `Successfully retrived book`,
                status: "success",
                code: HttpStatus.OK

            }
        } catch (error) {
            Logger.error(`Error retrieving book (${id}): ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error
            }
            throw Tools.ErrorWrapper("Something went wrong. Please try again", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }
    
    @Mutation(() => SuccessResponse)
    async updateBook(@Args('id', { type: () => Int}) id: number, @Args('updateInput') updateInput: UpdateInput): Promise<SuccessResponse>{
        try {
            Tools.checkPositiveId(id)
            await this.bookService.update(id, updateInput)
            return {
               message: `Successfully updated book`,
               status: "success",
               code: HttpStatus.OK 
            }
        } catch (error) {
            Logger.error(`Error updating book (${id}): ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error
            }
            throw Tools.ErrorWrapper("Something went wrong. Please try again", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }

    @Mutation(() => SuccessResponse)
    async deleteBook(@Args('id', { type: () => Int}) id: number): Promise<SuccessResponse>{
        try { 
            Tools.checkPositiveId(id)
            await this.bookService.remove(id)
            return {
                message: `Successfully deleted book`,
                status: "success",
                code: HttpStatus.OK 
             }
        } catch (error) {
            Logger.error(`Error updating book (${id}): ${error?.message}`)
            if(error instanceof GraphQLError){
                throw error
            }
            throw Tools.ErrorWrapper("Something went wrong. Please try again", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
        }
    }
}
