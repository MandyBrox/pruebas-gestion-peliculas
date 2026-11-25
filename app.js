//Cargamos las variables de entorno. Lee el archivo .env y utiliza esa configuración que está ahí guardada, así no se escribe de forma pública en el código
require('dotenv').config()

//Importa los módulos
const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/movieRoutes.js')
const webRouter = require('./routes/webRoutes.js')
const nunjucks = require('nunjucks')

//Crea la aplicación. A partir de app se puede definir las rutas, configurar middleware y arrancar el servidor
const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.set('view engine', 'njk')

//const PORT = 3000
//Le indica a mongoose donde está mongo (dirección:puerto) y la base de datos a la que nos queremos conectar
//const uri = 'mongodb://127.0.0.1:27017/movies' -> Antes de las variables de entorno

//Si existe port, la utilizas, si no usas el 3000
const PORT = Number(process.env.PORT || 3000)
//Obtiene la uri directamente del entorno
const uri = process.env.MONGODB_URI

  //Comprueba si uri no tiene un valor válido
if (!uri) {
   //Lanza el error y finaliza el programa
  console.error("Falta MONGODB_URI: crea .env a partir de .env.example")
  process.exit(1)
}

  //Si el puerto no es un número entero, es menor que 1 o mayor que 65535
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error('PORT ha de ser un enter entre 1 i 65535')
  process.exit(1)
}

//Middleware para recibir json y convertirlo en un objeto JS. Limita el tamaño del cuerpo del json recibido
app.use(express.json({ limit: '100kb' }))

app.use(express.urlencoded({ extended: false }))

app.use('/movies', router)

app.use('/', webRouter)


//Es un middleware que se ejecuta cuando una petición llega a Express y ninguna de las rutas anteriores la ha atendido
app.use((req, res) => res.status(404).json({ error: 'Ruta no trobada' }))

//Middleware especial para gestionar errores. Contiene el error que se ha producido, la petición, la respuesta y un next para pasar al siguiente error que gestiona el middleware
app.use((error, req, res, next) => {
    //Si el servidor ya está enviando una respuesta al cliente y aparece otro error con otra respuesta a enviar, esta línea deriva el error al siguiente gestor de errores de Express, porque no se puede cambiar una respuesta que ya se está enviando
  if (res.headersSent) return next(error)
    //Un error si el json no es correcto
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cos ha de ser JSON vàlid' })
    //Un error si el json pesa más de 100KB (lo habíamos indicado en el esquema)
  if (error.type === 'entity.too.large') return res.status(413).json({ error: 'El cos supera el límit permés' })
    //Si el nombre del error es ValidationError
  if (error.name === 'ValidationError') {
      //Devuelve el error. error.errors tiene los errores individuales de validación que se han producido y Object.values obtiene esos valores y los devuelve en un array. El map lo recorre y se queda con el mensaje de cada error. Así, lo que recibe el usuario es una lista con los mensajes concretos de cada error
    return res.status(400).json({ error: 'Dades no vàlides', details: Object.values(error.errors).map((detail) => detail.message) })
  }
    //Muestra el error en la consola si no coincide con ninguno de los anteriores
  console.error(error)
    //El usuario recibe un mensaje genérico de error
  return res.status(500).json({ error: 'Error intern del servidor' })
})

//Definimos una función iniciar()
async function iniciar() {
  try {
      //Esperamos a conectar con mongo
    await mongoose.connect(uri)
      //El servidor se pone a escuchar peticiones en el puerto y guarda en el resultado en una variable para poder acceder al servidor y escuchar sus eventos
    const server = app.listen(PORT, () => {
        //Muestra la dirección por consola
      console.log(`Servidor en http://localhost:${PORT}`)
    })
      //Si express no consigue arrancar: se registra un listeener para el evento error del servidor
    server.on('error', (error) => {
      console.error('No s\'ha pogut iniciar el servidor:', error.message)
        //Cerramos la conexión con mongo y finaliza el proceso de node.js (process.exit) después de cerrarse la conexión
      mongoose.disconnect().finally(() => process.exit(1))
    })
      //En el catch se capturan los errores que se producen durante las operaciones del try
  } catch (error) {
    console.error('No s\'ha pogut connectar a MongoDB:', error.message)
    process.exit(1)
  }
}

  //Ejecutamos la función
iniciar()