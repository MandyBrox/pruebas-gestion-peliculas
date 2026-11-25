
const express = require('express')
const router = express.Router()

const {
  mostrarPeliculas,
  mostrarPelicula,
  mostrarFormularioCrear,
  crearPeliculaWeb,
  mostrarFormularioEditar,
  editarPeliculaWeb,
  eliminarPeliculaWeb
} = require('../controllers/webController.js')

// Mostrar todas las películas
router.get('/', mostrarPeliculas)

// Crear película
router.get('/movie/new', mostrarFormularioCrear)
router.post('/movie/new', crearPeliculaWeb)

// Editar película
router.get('/movie/:id/edit', mostrarFormularioEditar)
router.post('/movie/:id/edit', editarPeliculaWeb)

// Mostrar una película concreta
router.get('/movie/:id', mostrarPelicula)

//Eliminar una película
router.post('/movie/:id/delete', eliminarPeliculaWeb)

module.exports = router
