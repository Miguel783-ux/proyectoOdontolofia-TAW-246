const API_URL = 'http://localhost:3000/auth';

// Definimos la estructura de lo que devuelve el backend
export interface LoginResponse {
  access_token: string;
  usuario: {
    matricula: string; // <-- Asegúrate de que esta línea exista aquí
    nombre: string;
    rol: string;
  };
}

export const loginService = async (
  matricula: string,
  contrasena: string,
  captchaIngresado: string,
  captchaReal: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matricula,
      contrasena,
      captchaIngresado,
      captchaReal,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  return data;
};
export const registerService = async (matricula: string, nombre: string, contrasena: string, rol: string): Promise<void> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ matricula, nombre, contrasena, rol }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar el usuario');
  }
};
