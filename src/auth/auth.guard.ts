import { Injectable, CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import * as Tools from "../utils/tool";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt"
import { GraphQLError } from "graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Convert to GraphQL context
        const gqlContext = GqlExecutionContext.create(context);
        // Get the arguments from the GraphQL context
        const req = gqlContext.getArgByIndex(2)['req'];
        const token = this.extractTokenFromHeader(req);
        
        if (!token) {
            throw Tools.ErrorWrapper("No token in header", {
                code: HttpStatus.FORBIDDEN,
                typename: "ForbiddenError"
            })
        }
            
        try {
            const decoded = this.jwtService.decode(token)
            if(!decoded){
                throw Tools.ErrorWrapper("Invalid token in header", {
                    code: HttpStatus.UNAUTHORIZED,
                    typename: "Authorization"
                })
            }
            req.user = decoded
            return true
        } catch (err) {
            if(err instanceof jwt.TokenExpiredError) {
                throw Tools.ErrorWrapper("Token is expired. Kindly login again", {
                    code: HttpStatus.UNAUTHORIZED,
                    typename: "Authorization"
                })
            }

            if(err instanceof GraphQLError){
                throw err
            }

            throw Tools.ErrorWrapper("Server error. Something went wrong", {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                typename: "ServerError"
            })
            
        }

    }
    private extractTokenFromHeader(request: any): string | null {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : null
    }
}