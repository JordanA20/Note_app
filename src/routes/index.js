const express = require('express');
const router = express.Router();
const Note = require('../models/notes'); //conf para el enlance donde se encuentra el modelo de datos

// Es para la Página principal donde se despliega el listado de todos los registros
router.get('/', async (req, res) => {
    const note = [];
    res.render('index', { note });
});

router.post('/', async (req, res) => {
  const note = [];
  res.render('index', { note });
});

// 
router.get('/:keyuser', async (req, res) => {
  try {
    const { keyuser } = req.params;
    const note = await Note.find({keyuser});
    res.render('index', { note });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/findkey:keyuser', async (req, res) => {
  try {
    const { keyuser } = req.params;
    const note = await Note.find({keyuser});
    note.length === 0 ? res.send({found: false}) : res.send({found: true});
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

// Agregamos a la base de datos cuando en el formulario envia por medio del post información a /add
router.post('/add:keyuser', async (req, res, next) => {
  try {
    const { keyuser } = req.params;
    const note = new Note({
      keyuser: keyuser,
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      color: req.body.color,
      checks: req.body.checks
    });
    await note.save();
    res.redirect(`/${keyuser}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
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
    await Note.updateOne({_id: id}, req.body);

    if(req.body.checks == undefined)
      await Note.updateOne({_id: id}, {'checks': []});
      
    res.redirect('/');
});
 
 // Se elimina un registro por medio de la busqueda del ID utilizando el método GET. 
router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Note.remove({_id: id});
    res.redirect('/');
});

router.get('/404', (req, res) => {
  res.render('page404')
})
  
module.exports = router;