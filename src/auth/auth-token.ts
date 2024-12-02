import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import { Observable, of } from "rxjs";
import { ForbiddenException, UnauthorizationException } from "src/utils/custom-exceptions.ts";
import { ErrorWrapper, handleError } from "src/utils/exceptions";
import { ResponseResult } from "src/dto";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt"
// import 
import { GraphQLError } from "graphql";
import { JwksClient } from "jwks-rsa";
import utils from 'util'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlContext = GqlExecutionContext.create(context);
        // Convert to GraphQL context
        // Get the arguments from the GraphQL context
        const req = gqlContext.getArgByIndex(2)['req'];
        const token = this.extractTokenFromHeader(req);
        console.log('key: ', process.env.AUTH0_CLIENT_SECRET)
        
            if (!token) {
                throw ErrorWrapper("No token in header", {
                    code: HttpStatus.FORBIDDEN,
                    typename: "ForbiddenError"
                })
            }
        const decode = this.decodeToken(token)

            console.log('here...: ', token)
            // const payload = await this.jwtService.verifyAsync(token, { secret: process.env.AUTH0_CLIENT_SECRET });
        const client = new JwksClient({
            jwksUri: "https://dev-qwjbxsbvc8ccbe2d.us.auth0.com/.well-known/jwks.json",
            rateLimit: true,
            cache: true,
            jwksRequestsPerMinute: 10
        })
        const getSignKey = utils.promisify(client.getSigningKey)
            
        try {
            // const key = await getSignKey(decode?.header?.kid)
            // const getSigningKey = key.
            // console.log('decoded: ', payload)
            // req.user = payload; // Attach decoded token to request or GraphQL context
            return true;
        } catch (err) {
            if(err instanceof jwt.JsonWebTokenError) {
                throw ErrorWrapper("Invalid token in header", {
                    code: HttpStatus.UNAUTHORIZED,
                    typename: "AuthorizationError"
                })
            }
            if(err instanceof jwt.TokenExpiredError) {
                throw ErrorWrapper("Token is expired. Kindly login again", {
                    code: HttpStatus.UNAUTHORIZED,
                    typename: "Authorization"
                })
            }
            throw err
        }

    }
    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request?.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        return authHeader.split(' ')[1];
    }

    private decodeToken(token: string){
        const decoded = jwt.decode(token, { complete: true, json: true })
        if(!decoded || !decoded.header || !decoded.header.kid){
        throw ErrorWrapper("Invalid token in header", {
            code: HttpStatus.UNAUTHORIZED,
            typename: "AuthorizationError"
        })
  }
    }
}