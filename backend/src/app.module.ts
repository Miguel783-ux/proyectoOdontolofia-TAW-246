import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './pacientes/pacientes.module'; // <-- Añadir
import { Usuario } from './auth/usuario.entity';
import { Paciente } from './pacientes/paciente.entity'; // <-- Añadir

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'dental_cloud',
      entities: [Usuario, Paciente], // <-- Añadir Paciente aquí
      synchronize: true,
    }),
    AuthModule,
    PacientesModule, // <-- Registrar módulo aquí
  ],
})
export class AppModule {}