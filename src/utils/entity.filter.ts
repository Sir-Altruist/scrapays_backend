import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(HttpException)
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // const gqlHost = GqlArgumentsHost.create(host);
    const response = exception.getResponse();

    return response; // Ensure this returns the proper shape for GraphQL
  }
}