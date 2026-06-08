import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_cita' })
  fechaCita: string;

  @Column()
  nombre: string;

  @Column()
  tratamiento: string;

  @Column({ name: 'doctor_matricula', nullable: true })
  doctorMatricula: string;

  // 🛡️ Campo para el flujo de estados
  @Column({ default: 'pendiente' })
  estado: string;

  // 📉 Campo obligatorio para la Eliminación Lógica (Requisito 3)
  @Column({ default: true })
  activo: boolean;
}