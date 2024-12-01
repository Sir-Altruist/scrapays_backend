import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from '../entities/book.entity';
import { CreateInput, UpdateInput, ResponseResult } from '../dto';
import { Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidateInput } from '../interceptors/validation';
import { ValidationFailedException } from 'src/utils/custom-exceptions.ts';
import { handleError } from 'src/utils/exceptions';
import { AuthGuard } from 'src/auth/auth-token';


@Resolver(Book)
export class BookResolver {
    constructor(private readonly bookService: BookService){}

    @Query(() => [Book])
    @UseGuards(AuthGuard)
    async findBooks(): Promise<Book[] | typeof ResponseResult>{
        try {
            return await this.bookService.findAll()
        } catch (error) {
            Logger.error(`Error retrieving all books: ${error?.message}`)
            return handleError(error);
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
