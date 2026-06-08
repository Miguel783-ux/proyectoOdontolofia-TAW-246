import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from './usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_DENTAL', // Cambia esto en producción
      signOptions: { expiresIn: '1d' },   // El token expira en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}