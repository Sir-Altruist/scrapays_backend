import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType('BaseError')
export class BaseError {
    @Field(() => String, { defaultValue: 'failed' })
    status: string;

    @Field(() => String)
    message: string;

    @Field(() => Int)
    code: number

    /** The Partial<BaseError> makes all properties of BaseError class optional 
     * That way, I am able to instantiate the BaseError class without explicitly passing the '__typename'
     * The Object.assign allows me to copy all the properties from the partial object to the current instance
     *
     *  */
    constructor(partial: Partial<BaseError>) {
        Object.assign(this, partial);
    }
}

@ObjectType('ValidationError')
export class ValidationError extends BaseError {
  @Field(() => String, { nullable: true })
  validationError?: string;

  constructor(partial: Partial<ValidationError>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@ObjectType('UnauthorizationError')
export class UnauthorizationError extends BaseError {
  @Field(() => String, { nullable: true })
  unauthorizationError?: string;
  badToken?: boolean

  constructor(partial: Partial<ValidationError>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@ObjectType('Forbidden')
export class ForbiddenError extends BaseError {
  @Field(() => String, { nullable: true })
  message: string;

  constructor(partial: Partial<ValidationError>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@ObjectType('NotFoundError')
export class NotFoundError extends BaseError {
  @Field(() => String, { nullable: true })
  resourceType?: string;

  constructor(partial: Partial<NotFoundError>) {
    super(partial);
    Object.assign(this, partial);
  }
}

@ObjectType('ServerError')
export class ServerError extends BaseError {
  @Field(() => String, { nullable: true })
  details?: string;

  constructor(partial: Partial<ServerError>) {
    super(partial);
    Object.assign(this, partial);
  }
}
