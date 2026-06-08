import { Injectable, NotFoundException } from '@nestjs/common'; // 🛡️ CORREGIDO: Se añade NotFoundException para solucionar el error 2304
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>, // El repositorio oficial está declarado en plural
  ) {}

  // Obtener todos los pacientes ordenados por fecha (Filtrando solo los activos)
  async obtenerTodos(): Promise<Paciente[]> {
    return this.pacientesRepository.find({
      where: { activo: true },
      order: { fechaCita: 'ASC' }
    });
  }

  // Eliminación lógica
  async eliminar(id: number): Promise<void> {
    await this.pacientesRepository.update(id, { activo: false });
  }

  // Crear un nuevo registro mapeado
  async crear(nombre: string, tratamiento: string, fechaCita: string, doctorMatricula: string): Promise<Paciente> {
    const nuevoPaciente = new Paciente();
    nuevoPaciente.nombre = nombre;
    nuevoPaciente.tratamiento = tratamiento;
    nuevoPaciente.fechaCita = fechaCita;
    nuevoPaciente.doctorMatricula = doctorMatricula;
    nuevoPaciente.estado = 'pendiente'; 
    nuevoPaciente.activo = true;        

    return this.pacientesRepository.save(nuevoPaciente);
  }

  // 🛠️ ACTUALIZAR COMPLETAMENTE CORREGIDO (Resuelve errores 2551 y 2339)
  async actualizar(id: number, datos: { nombre?: string; tratamiento?: string; fechaCita?: string; estado?: string }) {
    // 1. Buscamos usando 'pacientesRepository' (en plural) para solucionar el error de compilación
    const paciente = await this.pacientesRepository.findOne({ where: { id } });
    if (!paciente) throw new NotFoundException(`Paciente con ID ${id} no encontrado`);

    // 2. Mapeamos los campos entrantes
    if (datos.nombre !== undefined) paciente.nombre = datos.nombre;
    
    // Corregido: Se usa datos.tratamiento en lugar de datos.treatment para eliminar el error 2339
    if (datos.tratamiento !== undefined) paciente.tratamiento = datos.tratamiento; 
    
    if (datos.estado !== undefined) paciente.estado = datos.estado; 
    if (datos.fechaCita !== undefined) paciente.fechaCita = datos.fechaCita; 

    // 3. Guardamos usando el repositorio en plural 'pacientesRepository'
    return await this.pacientesRepository.save(paciente);
  }
}