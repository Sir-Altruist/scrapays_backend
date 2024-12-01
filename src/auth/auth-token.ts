import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean  {
        const ctx = context.getArgByIndex(2)
        const req = ctx.req || context.switchToHttp().getRequest()

        const token = this.extractTokenFromHeader(req);

        if (!token) throw new UnauthorizedException('No token provided')

        try {
            const decoded = jwt.verify(token, process.env.AUTH0_CLIENT_SECRET, {
                algorithms: ['HS256'],
            });
          
            // Check if this is an M2M token by inspecting `permissions` or `aud` claims
            // if (!decoded?.permissions) {
            //     throw new UnauthorizedException('Invalid M2M token');
            // }
            console.log('request: ', req)
            req.user = decoded; // Attach decoded token to request or GraphQL context
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }

    }
    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return null;
        }
        return authHeader.split(' ')[1];
      }
}