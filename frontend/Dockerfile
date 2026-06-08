# Etapa de construcción
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de servidor (usamos 'serve' para archivos estáticos)
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist /app/dist
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]