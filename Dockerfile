# 1. Usamos un Linux súper liviano con Node 20
FROM node:20-alpine

# 2. Creamos la carpeta donde vivirá tu app dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos solo los archivos de dependencias primero (para que Docker sea más rápido)
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos todo el resto de tu código
COPY . .

# 6. Generamos el cliente de Prisma para que pueda hablar con la base de datos
RUN npx prisma generate

# 7. Compilamos el código de TypeScript a JavaScript puro
RUN npm run build

# 8. Le decimos a Docker qué puerto usa tu app (el de NestJS por defecto)
EXPOSE 3000

# 9. El comando final que ejecuta tu app en producción
CMD ["npm", "run", "start:prod"]