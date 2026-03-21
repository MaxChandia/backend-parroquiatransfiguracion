import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Jwtstrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  })],
  providers: [AuthService, Jwtstrategy, ],
  exports:[AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
