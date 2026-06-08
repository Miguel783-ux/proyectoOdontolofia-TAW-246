import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { matricula: string; contrasena: string; captchaIngresado: string; captchaReal: string }
  ) {
    return this.authService.validarUsuario(
      body.matricula,
      body.contrasena,
      body.captchaIngresado,
      body.captchaReal
    );
  }
  @Post('register')
  async registrar(
    @Body() body: { matricula: string; nombre: string; contrasena: string; rol: string }
  ) {
    return this.authService.registrar(body.matricula, body.nombre, body.contrasena, body.rol);
  }
}