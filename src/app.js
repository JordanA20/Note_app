const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

//conexión a la BD
mongoose.connect('mongodb+srv://jrdn:ZOaWWAVXjq6cqZRJ@cluster0.opj2e.mongodb.net/DB-notes?retryWrites=true&w=majority') // DB-note vendría siendo el nombre de la base de datos, para mongoose se puede crear desde código
  .then(db => console.log('DB conectado'))
  .catch(err => console.log(err));


// Importar rutas
const indexRoutes = require('./routes/index');

//Configuración
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //Carpeta de las vistas
app.set('view engine', 'ejs'); // Motor de plantilla.
app.use(express.static('src/public'));

// middlewares
app.use(express.urlencoded({extended: false})) //Para interpretar los datos que vienen de un formulario y poder procesarlo

// rutas
app.use('/', indexRoutes);

//Inicialización del servidor
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});