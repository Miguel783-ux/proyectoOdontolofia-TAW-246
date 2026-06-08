import { Controller, Get, Delete, Param, ParseIntPipe, Put, Body, Post, Patch } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { Paciente } from './paciente.entity';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  async listarPacientes(): Promise<Paciente[]> {
    return this.pacientesService.obtenerTodos();
  }

  @Delete(':id')
  async eliminarPaciente(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.pacientesService.eliminar(id);
    return { message: 'Paciente eliminado correctamente' };
  }

  @Put(':id')
  async actualizarPaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { nombre?: string; tratamiento?: string; fechaCita?: string; estado?: string }
  ) {
    return this.pacientesService.actualizar(id, body);
  }

  @Post()
  async crearPaciente(@Body() crearPacienteDto: any) {
    const { nombre, tratamiento, fechaCita, matricula } = crearPacienteDto;
    return this.pacientesService.crear(nombre, tratamiento, fechaCita, matricula);
  }

  // 🛡️ RUTA PATCH CORREGIDA PARA NESTJS (Elimina el choque con Express y el error 404)
  @Patch(':id')
  async actualizarParcialPaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado?: string; fechaCita?: string }
  ) {
    // Reutilizamos tu método actualizar del servicio, pasándole solo los campos que cambian.
    // NestJS e TypeORM/Sequelize se encargarán de mapear 'estado' o 'fechaCita' según corresponda.
    return this.pacientesService.actualizar(id, body);
  }
}