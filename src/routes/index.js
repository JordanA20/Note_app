const express = require('express');
const router = express.Router();
const Note = require('../models/notes'); //conf para el enlance donde se encuentra el modelo de datos

// Es para la Página principal donde se despliega el listado de todos los registros
router.get('/', async (req, res) => {
    const note = await Note.find();
    let cont;
    res.render('index', {
      note,
      cont
    });
});

// Agregamos a la base de datos cuando en el formulario envia por medio del post información a /add
router.post('/add', async (req, res, next) => {
    const note = new Note(req.body);
    await note.save();
    x = await note;
    res.redirect('/');
});

// Actualizamos el estatus de la note que inicialmente está en falso.
// router.get('/turn/:id', async (req, res, next) => {
//     let { id } = req.params;
//     const note = await Note.findById(id);
//     note.status = !note.status; //Se actualizar el estatus al contrario que existe en la BD
//     await note.save();
//     res.redirect('/');
// });
  
 // Se recibe el id del registro para realizar una actualización. 
// router.get('/edit/:id', async (req, res, next) => {
//     const note = await Note.findById(req.params.id);
//     console.log(note);
//     res.render('note', { note });
// });
 
  // Se recibe del formulario de actualización los registros actualizados para llevarlo a la BD.  
router.post('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    await Note.update({_id: id}, req.body);

    if(req.body.checks == undefined){
      console.log(req.body.checks);
      await Note.update({_id: id}, {'checks': []});
    }
      
    res.redirect('/');
});
 
 // Se elimina un registro por medio de la busqueda del ID utilizando el método GET. 
router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Note.remove({_id: id});
    res.redirect('/');
});
  
module.exports = router;