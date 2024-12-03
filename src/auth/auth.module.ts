import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [],
  providers: [
    AuthResolver, 
    AuthService, 
    AuthGuard, 
    JwtService
  ],
  exports: [AuthGuard]
})
export class AuthModule {}
