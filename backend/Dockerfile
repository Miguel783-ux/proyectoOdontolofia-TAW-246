# 1. Imagen base ligera con Node.js
FROM node:18-alpine

# 2. Directorio donde vivirá la app dentro del contenedor
WORKDIR /app

# 3. Copiar archivos de dependencias primero (optimización de caché)
COPY package*.json ./

# 4. Instalar solo dependencias de producción
RUN npm install

# 5. Copiar el resto del código fuente
COPY . .

# 6. Compilar el proyecto (TypeScript -> JavaScript)
RUN npm run build

# 7. Exponer el puerto donde corre NestJS (usualmente 3000)
EXPOSE 3000

# 8. Comando para ejecutar la app una vez compilada
CMD ["npm", "run", "start:prod"]