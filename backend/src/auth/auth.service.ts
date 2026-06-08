import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async validarUsuario(matricula: string, contrasena: string, captchaIngresado: string, captchaReal: string) {
    // 1. Validar Captcha primero para ahorrar recursos de Base de Datos
    if (!captchaIngresado || !captchaReal || captchaIngresado.toUpperCase() !== captchaReal.toUpperCase()) {
      throw new UnauthorizedException('El código de verificación Captcha es incorrecto');
    }

    // 2. Buscar usuario por Matrícula
    const usuario = await this.usuarioRepository.findOne({ where: { matricula: matricula } });
    
    // 3. Validar si el usuario existe antes de operar cadenas
    if (!usuario) {
      throw new UnauthorizedException('La matrícula no existe en la Base de Datos');
    }

    // 4. Comparación segura usando los parámetros correctos del método (sin usar 'dto')
    if (usuario.matricula && matricula && usuario.matricula.toUpperCase() === matricula.toUpperCase()) {
      if (usuario.contrasena === contrasena) {
        
        // 5. Generar Token JWT con la información del usuario
        const payload = { matricula: usuario.matricula, nombre: usuario.nombre, rol: usuario.rol };
        const token = this.jwtService.sign(payload);
        
        return { token, usuario: payload };
      }
    }
    
    throw new UnauthorizedException('Matrícula o contraseña incorrectas');
  }

  async registrar(matricula: string, nombre: string, contrasena: string, rol: string): Promise<Usuario> {
    // Verificar si la matrícula ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({ where: { matricula: matricula } });
    if (usuarioExistente) {
      throw new BadRequestException('La matrícula ya está registrada en el sistema');
    }

    // Crear y guardar el nuevo doctor
    const nuevoUsuario = this.usuarioRepository.create({
      matricula,
      nombre,
      contrasena, // Guardada en texto plano para tus pruebas locales
      rol: rol || 'especialista',
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }
}