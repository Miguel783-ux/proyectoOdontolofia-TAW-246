-- 1. Limpieza previa (opcional, cuidado si ya tienes datos valiosos)
-- DROP TABLE IF EXISTS `logs`, `pacientes`, `usuarios`;

-- 2. Tabla de USUARIOS
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricula` VARCHAR(20) UNIQUE NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(20) DEFAULT 'doctor'
);

-- 3. Tabla de PACIENTES
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `tratamiento` VARCHAR(100),
  `fecha_cita` DATE,
  `doctor_matricula` VARCHAR(20),
  `estado` VARCHAR(20) DEFAULT 'pendiente',
  `activo` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`doctor_matricula`) REFERENCES `usuarios`(`matricula`)
);

-- 4. Tabla de LOGS (Para auditoría - Punto 11)
CREATE TABLE IF NOT EXISTS `logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario` VARCHAR(50),
  `ip` VARCHAR(45),
  `evento` VARCHAR(20),
  `browser` VARCHAR(100),
  `fechaHora` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `detalles` TEXT
);

-- 5. Inserción de USUARIOS (Doctores)
INSERT INTO `usuarios` (`matricula`, `nombre`, `password`, `rol`) VALUES 
('ADMIN001', 'Administrador Dental', '123456', 'doctor'),
('DOCTOR001', 'Dr. Juan Pérez', '12345', 'doctor'),
('DOCTOR002', 'Dra. María López', '1234', 'doctor');

-- 6. Inserción de PACIENTES
INSERT INTO `pacientes` (`nombre`, `tratamiento`, `fecha_cita`, `doctor_matricula`, `estado`, `activo`) VALUES 
('Carlos Gómez', 'Limpieza dental', '2024-07-01', 'DOCTOR001', 'pendiente', TRUE),
('Ana Martínez', 'Empaste', '2024-07-02', 'DOCTOR002', 'pendiente', TRUE);