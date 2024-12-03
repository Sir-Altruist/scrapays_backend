// error-handler.util.ts
import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export function ErrorWrapper(message: string, options: { code: number | string, typename: string}){
  return new GraphQLError(message, {
    extensions: {
      code: options.code,
      status: "failed",
      typename: options.typename
    }
  })
}

export function checkPositiveId(id: number){
  if(typeof id !== "number") {
    throw ErrorWrapper("Invalid Book Id type", {
      code: HttpStatus.BAD_REQUEST,
      typename: "AuthenticationError"
    })
  }

  if (id <= 0) {
    throw ErrorWrapper("Id must be a positive integer", {
      code: HttpStatus.BAD_REQUEST,
      typename: "AuthenticationError"
    })
  }
}
