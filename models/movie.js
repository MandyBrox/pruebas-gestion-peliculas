const mongoose = require('mongoose')

const currentYear = new Date().getFullYear() + 1

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'El títol és obligatori'], trim: true, minlength: 1, maxlength: 200 },
    year: { type: Number, required: true, min: 1888, max: currentYear },
    director: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    duration: { type: Number, required: true, min: 1, max: 600 },
    genre: {
      type: [{ type: String, trim: true, minlength: 1, maxlength: 50 }],
      required: true,
      validate: [(value) => Array.isArray(value) && value.length > 0, 'Cal indicar almenys un gènere']
    },
    rate: { type: Number, min: 0, max: 10, default: 0 },
    poster: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Movie', movieSchema)