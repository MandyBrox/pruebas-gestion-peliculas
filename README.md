# Gestión de películas: Node.js + MongoDB con Docker

Aplicación web desarrollada con Node.js, Express, MongoDB y Nunjucks para gestionar una colección de películas mediante operaciones CRUD (crear, consultar, modificar y eliminar).

El proyecto sigue el patrón MVC (Modelo-Vista-Controlador).

Las imágenes Docker están publicadas en GitHub Container Registry (GHCR):

- `ghcr.io/mandybrox/peliculas-app:1.0`: aplicación Node.js.
- `ghcr.io/mandybrox/peliculas-mongo:1.0`: MongoDB 8.0 con los datos iniciales de películas.

## Requisitos

Solo es necesario tener instalado Docker con Docker Compose.

No hace falta instalar Node.js, npm ni MongoDB en el ordenador.

## Puesta en marcha

Clonar el repositorio:

```bash
git clone https://github.com/MandyBrox/pruebas-gestion-peliculas.git
cd pruebas-gestion-peliculas
```

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En PowerShell de Windows se puede utilizar:

```powershell
Copy-Item .env.example .env
```

Se recomienda editar `.env` y cambiar la contraseña de ejemplo por una propia.

Descargar las imágenes desde GHCR:

```bash
docker compose pull
```

Iniciar los contenedores:

```bash
docker compose up -d
```

La aplicación estará disponible en:

**http://localhost:3000**

## Comprobar el funcionamiento

Para comprobar el estado de los contenedores:

```bash
docker compose ps
```

MongoDB debe aparecer como `healthy` y la aplicación como `running` o `Up`.

La aplicación incluye 16 películas iniciales que se importan automáticamente cuando MongoDB utiliza un volumen vacío por primera vez.

## Detener la aplicación

Para detener los contenedores:

```bash
docker compose down
```

Los datos de MongoDB se conservan en el volumen de Docker.

Para detener los contenedores y eliminar también el volumen con los datos:

```bash
docker compose down -v
```

**Atención:** esta última operación elimina los datos almacenados en MongoDB. Al volver a iniciar el proyecto se importarán de nuevo los datos iniciales.

## Funcionalidades

La aplicación permite:

- Consultar todas las películas.
- Consultar los detalles de una película.
- Añadir películas.
- Modificar películas existentes.
- Eliminar películas.
- Gestionar la colección desde una interfaz web.

## Estructura del proyecto

```text
pruebas-gestion-peliculas/
├── controllers/       # Lógica de las operaciones
├── models/            # Modelo y esquema de películas
├── routes/            # Rutas de la aplicación
├── views/             # Plantillas Nunjucks
├── mongo/
│   ├── Dockerfile     # Imagen personalizada de MongoDB
│   ├── movies.json    # Datos iniciales
│   └── 01-importar-movies.sh
├── .dockerignore
├── .env.example
├── .gitignore
├── app.js
├── Dockerfile         # Imagen de la aplicación Node.js
├── docker-compose.yaml
├── package.json
└── README.md
```

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Nunjucks
- Docker
- Docker Compose
- GitHub Container Registry (GHCR)