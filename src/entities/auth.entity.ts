import { Field, ObjectType, ID } from "@nestjs/graphql";


@ObjectType()
export class User {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field()
    email: string

    @Field()
    password?: string

    @Field()
    username: string

    @Field({ nullable: true })
    connection?: string
}

