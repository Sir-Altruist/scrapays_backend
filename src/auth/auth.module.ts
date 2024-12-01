import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-token';

@Module({
  providers: [AuthResolver, AuthService, AuthGuard]
})
export class AuthModule {}
