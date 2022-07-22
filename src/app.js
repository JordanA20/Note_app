const mongoose = require('mongoose');
const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
const app = express();
// const morgan = require('morgan');

//conexión a la BD
mongoose.connect('mongodb://localhost/BD-notes') // BD-lab2 vendría siendo el nombre de la base de datos, para mongoose se puede crear desde código
  .then(db => console.log('DB conectado'))
  .catch(err => console.log(err));


// Importar rutas
const indexRoutes = require('./routes/index');

//Configuración
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //Carpeta de las vistas
app.set('view engine', 'ejs'); // Motor de plantilla.
// app.use(bodyParser.json());
app.use(express.static('src/public'));

// middlewares
// app.use(morgan('dev')); // Con morgan podemos ver los procesos en la vista de la consola.
app.use(express.urlencoded({extended: false})) //Para interpretar los datos que vienen de un formulario y poder procesarlo

// rutas
app.use('/', indexRoutes);


//Inicialización del servidor
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});