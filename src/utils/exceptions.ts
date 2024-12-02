// error-handler.util.ts
// @apollo-server covers these
// import { JSONApiResponse } from 'src/entities/response.entity';
import { JSONApiResponse } from 'src/entities/response.entity';
import { BaseError, ValidationError, ServerError, NotFoundError, UnauthorizationError, ForbiddenError } from '../entities/exceptions.entity';
import { 
  ResourceNotFoundException, 
  ValidationFailedException, 
  ServerErrorException,
  UnauthorizationException,
  ForbiddenException, 
  // SuccessResponse
} from './custom-exceptions.ts';
import { HttpStatus } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { User } from 'src/entities/auth.entity';
import { GraphQLError } from 'graphql';
import { JwksClient } from 'jwks-rsa';
import util from 'util'
import * as jwt from 'jsonwebtoken'
// import { JWE}

export function handleError(error: Error): BaseError {
  console.log('error: ', error)
  if (error instanceof ResourceNotFoundException) {
    return new NotFoundError({
        status: "failed",
        message: error.notFoundError,
        code: HttpStatus.NOT_FOUND
    });
  }

  if (error instanceof ValidationFailedException) {
    return new ValidationError({
        status: "failed",
        message: error.validationError,
        code: HttpStatus.BAD_REQUEST
    });
  }

  if (error instanceof UnauthorizationException) {
    return new UnauthorizationError({
        status: "failed",
        message: error.unauthorizationError,
        code: HttpStatus.UNAUTHORIZED
    });
  }

  if (error instanceof ForbiddenException) {
    console.log('forbid: ', error)
    return new ForbiddenError({
        status: "failed",
        message: error.message,
        code: HttpStatus.FORBIDDEN
    });
  }

  if (error instanceof ServerErrorException) {
    return new ServerError({
        status: "failed",
        message: "Something went wrong. Please try again",
        code: HttpStatus.INTERNAL_SERVER_ERROR
    });
  }

  if (error instanceof ServerErrorException) {
    return new ServerError({
        status: "failed",
        message: "Something went wrong. Please try again",
        code: HttpStatus.INTERNAL_SERVER_ERROR
    });
  }

  // throw new ValidationFailedException(formattedErrors[0])
  // Fallback for unexpected errors
  return new ServerError({
        status: "failed",
        message: 'An unexpected error occurred. Please try again',
        code: HttpStatus.INTERNAL_SERVER_ERROR
  });
}

// export function handleSuccess<T>(data: {
//   message: string, 
//   code?: number, 
//   details: any;
// }) {
//     return new JSONApiResponse({
//       message: data.message,
//       code: data.code || HttpStatus.OK,
//       details: data?.details
//       // user: data?.user,
//       // books: data?.books,
//       // book: data?.book,
//       // token: data?.token,
//       // otp: data?.otp
//     })
// }

export function SuccessWrapper<T>(data: T, message: string, extensions: { code: number; typename: string }) {
  return {
    data,
    message,
    extensions: {
      code: extensions.code,
      typename: extensions.typename,
    },
  };
}

export function ErrorWrapper(message: string, options: { code: number | string, typename: string}){
  return new GraphQLError(message, {
    extensions: {
      code: options.code,
      status: "failed",
      typename: options.typename
    }
  })
}

export async function verifyToken(token: string){
  const client = new JwksClient({
    jwksUri: "",
    rateLimit: true,
    cache: true,
    jwksRequestsPerMinute: 10
  })

  const getSignKey = util.promisify(client.getSigningKey)
  const decoded = jwt.decode(token, { complete: true, json: true })
  if(!decoded || !decoded.header || !decoded.header.kid){
    throw ErrorWrapper("Invalid token in header", {
      code: HttpStatus.UNAUTHORIZED,
      typename: "AuthorizationError"
    })
  }
}