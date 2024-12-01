import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import { Observable, of } from "rxjs";
import { ForbiddenException, UnauthorizationException } from "src/utils/custom-exceptions.ts";
import { handleError } from "src/utils/exceptions";
import { ResponseResult } from "src/dto";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt"
import { GraphQLError } from "graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext) {
        const gqlContext = GqlExecutionContext.create(context);
             // Convert to GraphQL context
             // Get the arguments from the GraphQL context
        const req = gqlContext.getArgByIndex(2)['req'];
        const token = this.extractTokenFromHeader(req);
        console.log('token: ', token)
        
        try {
            if (!token) {
                console.log('Token is invalid')
                // throw new GraphQLError('Invalid token in header', {
                //     extensions: {
                //       code: 'Forbidden',
                //       status: 'failed',
                //       message: 'No token found',
                //       __typename: 'Forbidden',
                //     },
                // });
                // throw new ForbiddenException('No token in header')
                // throw handleError({ message: 'No token in header', name: 'Forbidden'})
                // return {
                //     __typename: 'UnauthorizedError',
                //     status: 'failed',
                //     message: 'No token provided',
                //     code: 401
                // };
                throw new GraphQLError('No token in header', {
                    extensions: {
                        code: 403,
                        status: 'failed',
                        message: 'No token in header',
                        __typename: 'Forbidden'
                    }
                });
                // return handleError({ message: "No token provided", name: "UnauthorizationException" })
                // return of(new UnauthorizationException('No token provided')) 
            }
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.AUTH0_CLIENT_SECRET });
            console.log('decoded: ', payload)
            req.user = payload; // Attach decoded token to request or GraphQL context
            return true;
        } catch (err) {
            console.log('authorization: ', err)
            if(err instanceof jwt.JsonWebTokenError) throw new UnauthorizationException("Invalid token in header", true)
            if(err instanceof jwt.TokenExpiredError) throw new UnauthorizationException("Token is expired. Kindly login again", true)
            // if(err instanceof ForbiddenException) {
                // throw new ForbiddenException('No token in header')
                // throw new GraphQLError('Invalid token in header', {
                //     extensions: {
                //       code: 'Forbidden',
                //       status: 'failed',
                //       message: 'No token found',
                //       __typename: 'Forbidden',
                //     },
                // });
            // }
            throw err
            // throw handleError(err)
            // return false
            // throw handleError({
            //     message: err?.message,
            //     name: "forbidden"
            // })
            // return false
            // return of(handleError(err))
            // throw new UnauthorizationException('Invalid or expired token', true);
        }

    }
    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request?.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        console.log('authHeader: ', authHeader)
        return authHeader.split(' ')[1];
      }
}