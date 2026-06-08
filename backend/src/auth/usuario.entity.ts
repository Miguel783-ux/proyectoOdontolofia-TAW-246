import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number; // <-- Agregar el signo '!' antes de los dos puntos

  @Column({ unique: true })
  matricula!: string; // <-- '!' añadido

  @Column()
  nombre!: string; // <-- '!' añadido

  @Column()
  contrasena!: string; // <-- '!' añadido

  @Column({ default: 'especialista' })
  rol!: string; // <-- '!' añadido
}