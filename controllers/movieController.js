const Movie = require('../models/movie')
const mongoose = require('mongoose')

async function getAllMovies(req, res) {
    //Filtra por género (?genre=Terror -> genre será Terror)
    //genre va entre llaves para utilizarlo de variable y de petición (req.query.genre)
  const { genre } = req.query
    //Crea un objeto vacío
  const filter = {}
    //si se ha recibido el género (sale undefined si no se especifica un género)
  if (genre !== undefined) {
        //Comprueba que sea una cadena o que no esté vacío (con trim quita los espacios de los extremos y mira que no se quede "" o "    ")
    if (typeof genre !== 'string' || genre.trim() === '') {
        //Si se cumple, envía un mensaje de error y return sale de la función
      return res.status(400).json({ error: 'genre ha de ser un text no buit' })
    }
        //Esto es para proteger la búsqueda. Reemplaza los primeros caracteres especiales por una verisón escapada para que al buscar no se confundan
    const escapedGenre = genre.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        //El género de filter es una expresión regular (RegExp) que indica que no se distinga entre mayus y minus (i) y marca el inicio y el final del texto con ^ y $ para que tenga que coincidir entero
    filter.genre = new RegExp(`^${escapedGenre}$`, 'i')
  }
    //movies = esperar a que Movie.find (busca en la base de datos), filter (las pelis de ese género, o todas no filter está vacío) .sort (los ordena por orden de titulo ascendente al decirle 1)
  const movies = await Movie.find(filter).sort({ title: 1 })
    //Envía la respuesta
  return res.json(movies)

}

async function getMovieById(req, res) {
       //Si no recibe un id válido. Este es un método de mongoose que mira si el identificador es ObjectId (que es el que utiliza) o un String Hexadecimal (porque todos los ids que utiliza son en formato hexadecimal de 24 caracteres)
      if (!mongoose.isObjectIdOrHexString(req.params.id)) {
          //Salta el error
        return res.status(400).json({ error: 'Identificador no vàlid' })
      }
        //Si no busca por id con el req.params.id que ha recibido en la consulta y lo guarda en movie
      const movie = await Movie.findById(req.params.id)
          //Si movie está vacío porque no ha encontrado nada, salta error
      if (!movie) return res.status(404).json({ error: 'Pel·lícula no trobada' })
        //Si no devuelve el json con la respuesta
      return res.json(movie)
}

//Las propiedades permitidas que se pueden recibir
const campsPermesos = ['title', 'year', 'director', 'duration', 'genre', 'rate', 'poster']

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

//Construye un nuevo objeto. Recibe body que, por ejemplo, tiene title, year y director.
function movieData(body) {
    //Crea el objeto vacío
  const data = {}
    //Recorre campsPermesos y camp será cada uno de los elementos del array según la vuelta.
    //Comprueba si existe camp en body. Si existe, mete en data camp con el valor que se ha recibido por el body
  for (const camp of campsPermesos) if (Object.hasOwn(body, camp)) data[camp] = body[camp]
  return data
}

async function createMovie(req, res) {
    //Si no recibe un objeto, lanza el error
  if (!isPlainObject(req.body)) return res.status(400).json({ error: 'El cos ha de ser un objecte JSON' })
    //Si es un objeto, crea la película con la función movieData que teníamos arriba
  const movie = await Movie.create(movieData(req.body))
   //Envía la respuesta con un status de que todo ha ido bien
  return res.status(201).json(movie)
}

async function updateMovie(req, res) {
    //Comprueba el id
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: 'Identificador no vàlid' })
  }
    //Comprueba si es un objeto
  if (!isPlainObject(req.body)) return res.status(400).json({ error: 'El cos ha de ser un objecte JSON' })
    //Guardamos en udate las modificaciones permitidas que ha comprobado movieData
  const update = movieData(req.body)
    //Comprueba que haya algún campo que modificar. Guarda en update los nombres de las propiedades. Si es 0, no hay nada que modificar
  if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No hi ha camps per actualitzar' })
    //Buscamos por el id y modificamos los campos que hay en update
  const movie = await Movie.findByIdAndUpdate(req.params.id, update, {
      //Devuelve luego la peli after la modificación. Añade las validaciones del esquema a los campos modificados
    returnDocument: 'after', runValidators: true
  })
    //Si no hay peli, error
  if (!movie) return res.status(404).json({ error: 'Pel·lícula no trobada' })
    //Si hay peli, la devuelve modificada
  return res.json(movie)
}

async function deleteMovie(req, res) {
   //Comprobar si el id es válido
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ error: 'Identificador no vàlid' })
  }
    //Guardamos en movie la que queremos eliminar
  const movie = await Movie.findByIdAndDelete(req.params.id)
    //Si no encuentra nada, código de eroor
  if (!movie) return res.status(404).json({ error: 'Pel·lícula no trobada' })
    //Se confirma que la operación ha concluido con éxito con el código 204 (no content) y le ponemos fin
  return res.status(204).end()
}

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie }