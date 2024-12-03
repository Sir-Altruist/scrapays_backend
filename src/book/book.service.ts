import { HttpStatus, Injectable } from '@nestjs/common';
import { Book } from '../entities/book.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInput, UpdateInput } from '../dto'
import * as Tools from '../utils/tool'

@Injectable()
export class BookService {

    constructor(@InjectRepository(Book) private readonly bookRepository: Repository<Book>){}

    async create(createInput: CreateInput): Promise<Book>{
        const newBook = this.bookRepository.create(createInput)
        return await this.bookRepository.save(newBook) 
    }

    async findAll(): Promise<Book[]>{
        return await this.bookRepository.find();
    }

    async findOne(id: number): Promise<Book>{
        const book = await this.bookRepository.findOne({
            where: { id }
        })
        if(!book) {
            throw Tools.ErrorWrapper(`Book cannot be found`, {
                code: HttpStatus.NOT_FOUND,
                typename: "NotFoundError"
            })
        }
        return book;
    }

    async update(id: number, updateInput: UpdateInput): Promise<Book> {
        const book = await this.bookRepository.preload({ id, ...updateInput })
        if (!book) {
            throw Tools.ErrorWrapper(`Book cannot be found`, {
                code: HttpStatus.NOT_FOUND,
                typename: "NotFoundError"
            })
        }
        return await this.bookRepository.save(book)
    }

    async remove(id: number): Promise<Book>{
        const book = await this.bookRepository.preload({ id })
        if (!book) {
            throw Tools.ErrorWrapper(`Book cannot be found`, {
                code: HttpStatus.NOT_FOUND,
                typename: "NotFoundError"
            })
        }
        return await this.bookRepository.remove(book);
    }
}
