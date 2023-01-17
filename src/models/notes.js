//Modelo de la base de datos

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// Esquema de la nota
const TaskSchema = Schema({ // Se define los campos y el tipo de datos
  keyuser: String,
  title: String,
  content: String,
  type: { //Este objeto para cuendo se cree una nota tenga un type note.
    type: String,
    default: 'note'
  },
  color: { //Este objeto para cuendo se cree una nota tenga un color predeterminado.
    type: String,
    default: 'dark'
  },
  checks: Array
});

// Toma el esquema y lo guarda en la colleccion 'notes' dentro de mongoDB
module.exports = mongoose.model('notes', TaskSchema); 