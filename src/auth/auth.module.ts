import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth-token';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/middlewares/auth';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: "60s"},
      secret: 'sample'
    })
  ],
  providers: [AuthResolver, AuthService, AuthMiddleware]
})
export class AuthModule {}
