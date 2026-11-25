const Movie = require('../models/movie')


// Mostrar todas las películas
async function mostrarPeliculas(req, res) {
  try {
    const director = req.query.director

let peliculas

if (director) {
    peliculas = await Movie.find({
        director: director
    }).sort({ title: 1 })
} else {
    peliculas = await Movie.find().sort({ title: 1 })
}

    res.render('movies', { peliculas })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar las películas')
  }
}

// Mostrar una película concreta
async function mostrarPelicula(req, res) {
  try {
    const pelicula = await Movie.findById(req.params.id)

    if (!pelicula) {
      return res.status(404).send('Película no encontrada')
    }

    res.render('movieDetail', { pelicula })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar la película')
  }
}

// Mostrar el formulario para crear una película
function mostrarFormularioCrear(req, res) {
  res.render('newMovie')
}

// Guardar una película nueva
async function crearPeliculaWeb(req, res) {
  try {
    const nuevaPelicula = {
      title: req.body.title,
      year: Number(req.body.year),
      director: req.body.director,
      duration: Number(req.body.duration),
      genre: req.body.genre.split(',').map(genero => genero.trim()).filter(Boolean),
      rate: Number(req.body.rate),
      poster: req.body.poster
    }

    await Movie.create(nuevaPelicula)

    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(400).send('Error al guardar la película')
  }
}

// Mostrar formulario para editar una película
async function mostrarFormularioEditar(req, res) {
  try {
    const pelicula = await Movie.findById(req.params.id)

    if (!pelicula) {
      return res.status(404).send('Película no encontrada')
    }

    res.render('editMovie', { pelicula })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar el formulario')
  }
}

// Guardar los cambios de una película
async function editarPeliculaWeb(req, res) {
  try {
    const datosActualizados = {
      title: req.body.title,
      year: Number(req.body.year),
      director: req.body.director,
      duration: Number(req.body.duration),
      genre: req.body.genre.split(',').map(genero => genero.trim()).filter(Boolean),
      rate: Number(req.body.rate),
      poster: req.body.poster
    }

    const pelicula = await Movie.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { runValidators: true, returnDocument: 'after' }
    )

    if (!pelicula) {
      return res.status(404).send('Película no encontrada')
    }

    res.redirect(`/movie/${pelicula._id}`)
  } catch (error) {
    console.error(error)
    res.status(400).send('Error al actualizar la película')
  }
}

// Eliminar una película
async function eliminarPeliculaWeb(req, res) {
  try {
    const pelicula = await Movie.findByIdAndDelete(req.params.id)

    if (!pelicula) {
      return res.status(404).send('Película no encontrada')
    }

    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al eliminar la película')
  }
}

module.exports = { mostrarPeliculas, mostrarPelicula, mostrarFormularioCrear, crearPeliculaWeb, mostrarFormularioEditar, editarPeliculaWeb, eliminarPeliculaWeb }