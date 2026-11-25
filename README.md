# Gestión de películas

Aplicación web desarrollada con Node.js, Express y MongoDB para gestionar una colección de películas mediante operaciones CRUD (crear, consultar, actualizar y eliminar).

El proyecto está organizado siguiendo el patrón **MVC (Modelo-Vista-Controlador)** y utiliza Nunjucks para generar las páginas HTML.

## Requisitos previos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- MongoDB

## Instalación

1. Descargar o clonar el proyecto.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar las dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la carpeta principal del proyecto, tomando como referencia `.env.example`.

Configurar las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/nombre_base_datos
```

Asegurarse de que MongoDB está en funcionamiento antes de iniciar la aplicación.

Si se utiliza Docker Compose, se puede iniciar el servicio de MongoDB con:

```bash
docker compose up -d
```

## Ejecución

Iniciar el servidor con:

```bash
npm start
```

La aplicación estará disponible en:

- Interfaz web: http://localhost:3000/
- API: http://localhost:3000/movies

## Funcionalidades

La aplicación permite:

- Consultar todas las películas.
- Consultar una película por su identificador.
- Añadir películas.
- Modificar películas existentes.
- Eliminar películas.
- Gestionar las películas desde una interfaz web.

## Estructura del proyecto

- **models/**: contiene el modelo Movie y el esquema de datos de Mongoose.
- **controllers/**: contiene las funciones que implementan la lógica de las operaciones CRUD.
- **routes/**: define las rutas de la API y de la interfaz web y las asocia con sus controladores.
- **views/**: contiene las plantillas Nunjucks que generan las páginas HTML.
- **app.js**: configura Express, establece la conexión con MongoDB y registra las rutas.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Nunjucks
- dotenv