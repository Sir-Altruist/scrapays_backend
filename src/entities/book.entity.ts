import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class Book {
    @PrimaryGeneratedColumn()
    @Field(type => Int, { nullable: true })
    id: number

    @Column()
    @Field()
    name: string

    @Column()
    @Field()
    description: string

    // @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    // public created_at: Date;

    // @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    // public updated_at: Date;
}