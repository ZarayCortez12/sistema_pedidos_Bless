# Sistema de Pedidos

## Descripción

Este proyecto corresponde a una prueba técnica cuyo objetivo es desarrollar un sistema de gestión de pedidos, inventario y ventas.

La aplicación fue desarrollada utilizando:

- Node.js
- Express
- Sequelize ORM
- SQLite

Se implementó una arquitectura tipo **API REST monolítica**, estructurada por capas (modelos, migraciones, controladores y rutas).

El proyecto utiliza **SQLite**, por lo que no requiere configuración adicional de servidor de base de datos.

---

## Tecnologías Utilizadas

- Node.js
- Express.js
- Sequelize
- Sequelize CLI
- SQLite
- Nodemon
- Vite (Frontend)

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrese de tener instalado:

- Node.js (v16 o superior recomendado)
- npm (incluido con Node.js)

## Instalación

### 1. Clonar el repositorio:

git clone https://github.com/ZarayCortez12/sistema_pedidos_Bless.git

### 2. Instalar dependencias:

npm install

## Ejecución del Proyecto

### 1. Ejecutar migraciones

Esto creará automáticamente la base de datos y las tablas:

npx sequelize-cli db:migrate

Si todo está correcto, se generará el archivo:

database.sqlite

### 2. Ejecutar seeders

npx sequelize-cli db:seed:all

### 3. Iniciar servidor en desarrollo

npm run dev

O si no existe script dev:

node app.js

El servidor del backendse ejecutará en: http://localhost:4000
El servidor del frontend se ejecutará en: http://localhost:5173

## 👩‍💻 Autor

Maria Zaray Cortez Castro
Estudiante de Ingeniería de Sistemas
