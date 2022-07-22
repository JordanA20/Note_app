const contMdl = document.querySelector('.container');
const contOpt = document.querySelector('.options');
const items = document.querySelector('.items');
let checks = [];

// Mostrar el modal de la nota.
items.addEventListener('click', e => {
  let x = e.target;

  if(!(x.classList.contains('items'))) {
    if(x.parentElement.classList.contains('items-note'))
      x = x.parentElement;
    else if(x.classList.contains('items-booton'))
      x = x.parentElement.parentElement.children[0];

    SetNote(x);

    if(x.dataset.type == 'task') {
      checks = x.dataset.checks.split(',');
      ChangeToTask();
    }

    contMdl.style.display = 'flex';
  }
});

// Guarda o actualiza la nota y hace desaparecer el modal de la nota.
contMdl.addEventListener('click', e => {
  let x = e.target;
  let form = document.querySelector('#noteForm');

  if(x.id == 'close' || x.id == 'noteForm') {
    if(document.querySelector('#noteId').value == '') { // Guardar no si tiene contenido.
      if(!(document.querySelector('#noteTitle').value == ''
       && document.querySelector('#noteContent').value == '')) // Si la nota tiene contenido cambia el acction del form para guardarla.
        form.action = '/add';
      else // Si esta vacia vulve el metodo get para regresar a inicio sin guardar la nota
      form.method = 'get'
    } else // Actualizar nota.
      form.action = `/update/${(document.querySelector('#noteId').value)}`;
    
    ChangeToNote();
    if(x.id == 'noteForm') // Enviar el formulario si se sale sin utilizar el boton del formulario.
      form.requestSubmit();
      
    contMdl.style.display = 'none';
  }
  else if(x.classList.contains('task-checkbox'))
    SetChecks(null);
  else if(x.id == 'newTask' || x.id == 'lblNewTask')
    AddTask('');
  else if(x.classList.contains('task-delete'))
    DeleteTask(x);
});

// Activar el color hover para el div booton del item.
items.addEventListener('mouseover', e => {
  let x = e.target;
  let c;
  if(x.classList.contains('items-note')) {
    c = x.dataset.color;
    x.parentElement.children[1].style.backgroundColor = `var(--${c}-hover)`;
    x.parentElement.children[1].children[0].style.backgroundColor = `var(--${c}-hover)`;
  }
  else if(x.classList.contains('items-booton')) {
    c = x.parentElement.parentElement.children[0].dataset.color;
    x.parentElement.parentElement.children[1].children[0].style.backgroundColor = `var(--${c}-hover)`;
    x.parentElement.parentElement.children[1].style.backgroundColor = `var(--${c}-hover)`;
  }
});

// Desactivar el color hover para el div booton del item.
items.addEventListener('mouseout', e => {
  let x = e.target;
  let c;
  if(x.classList.contains('items-note')) {
    c = x.dataset.color;
    x.parentElement.children[1].style.backgroundColor = `var(--${c})`;
    x.parentElement.children[1].children[0].style.backgroundColor = `var(--${c})`;
  }
  else if(x.classList.contains('items-booton')) {
    c = x.parentElement.parentElement.children[0].dataset.color;
    x.parentElement.parentElement.children[1].children[0].style.backgroundColor = `var(--${c})`;
    x.parentElement.parentElement.children[1].style.backgroundColor = `var(--${c})`;
  }
});

// Evento de la barra de opciones de la nota.
contOpt.addEventListener('click', e => {
  let x = e.target;

  if(x.id == 'bgColor') { // Mostar y desaparecer la lista de colores.
    // document.querySelector('#list-color').classList.toggle('visible');
    if(document.querySelector('#list-color').style.display == 'none')
      document.querySelector('#list-color').style.display = 'flex';
    else if(document.querySelector('#list-color').style.display == 'flex')
      document.querySelector('#list-color').style.display = 'none';
  }
  else if(x.classList.contains('color')) // Envia el color eligido la lista al metodo para cambiar el color.
    ChangeColor(x.id);
  else if(x.id == 'chgTask') { // Cambia el contenido a nota o tareas.
    if(document.querySelector('#noteType').value == 'note') {
      document.querySelector('#noteType').value = 'task';
      ChangeToTask();
    } else {
      document.querySelector('#noteType').value = 'note';
      ChangeToNote();
    }
  }
  else if(x.id == 'delete') { // Eliminar la nota seleccionada.
    if(!(document.querySelector('#noteId').value == '')) {
      if(window.confirm('¿Desea eliminar la nota?'))
        window.location.href = `/delete/${document.querySelector('#noteId').value}`;
    }
  }
});


// Funciones.
// Asiganar los datos en el modal nota.
const SetNote = (x) => {
  if(!(x.classList.contains('items-note'))) { // Quita los datos del modal.
    document.querySelector('#noteId').value = '';
    document.querySelector('#noteTitle').value = '';
    document.querySelector('#noteContent').value = '';
    document.querySelector('#noteType').value = 'note';
    document.querySelector('#noteColor').value = 'dark';
  } else { // Asinga los datos de la nota a los elementos del modal.
    document.querySelector('#noteId').value = x.dataset.id;
    document.querySelector('#noteTitle').value = x.dataset.title;
    document.querySelector('#noteContent').value = x.dataset.content;
    document.querySelector('#noteType').value = x.dataset.type;
    document.querySelector('#noteColor').value = x.dataset.color;
  }
  ChangeColor(x.dataset.color); // Llama a la funcion que cambiar el color de la nota.
}

// Cambia la clase de color del contenedor de la nota.
const ChangeColor = (x) =>{
  if(contMdl.classList.contains('dark')) {
    document.querySelector('#noteColor').value = x;
    contMdl.classList.replace('dark', x);
  }
  else if(contMdl.classList.contains('red')) {
    document.querySelector('#noteColor').value = x;
    contMdl.classList.replace('red', x);
  }
  else if(contMdl.classList.contains('green')) {
    document.querySelector('#noteColor').value = x;
    contMdl.classList.replace('green', x);
  }
  else if(contMdl.classList.contains('blue')) {
    document.querySelector('#noteColor').value = x;
    contMdl.classList.replace('blue', x);
  } else {
    if(x == undefined) {
      document.querySelector('#noteColor').value = 'dark';
      contMdl.classList.add('dark');
    } else {
      document.querySelector('#noteColor').value = x;
      contMdl.classList.add(x);
    }
  }
}

// Cambia el contenido de nota a tareas.
const ChangeToTask = () =>{
  let x = document.querySelector('#noteTask');
  let cnt = document.querySelector('#noteContent').value.split('\n');
  
  if(!(x.children[0].firstChild == null)) {
    while (x.children[0].firstChild) {
      x.children[0].removeChild(x.children[0].firstChild);
    }
  }

  cnt.forEach(data => {
    if(!(data == ''))
      AddTask(data);
  });

  document.querySelector('#noteContent').style.display = 'none';
  x.style.display = 'flex';
}

// Cambia el contenido de tareas a nota.
const ChangeToNote = () =>{
  let x = document.querySelector('.taskContent').children;
  let cnt = document.querySelector('#noteContent');
  let c = '';
  checks = [];

  Object.values(x).forEach(data => {
    c = c + data.children[1].textContent + '\n';
  });

  cnt.value = c;

  document.querySelector('#noteContent').style.display = 'flex';
  document.querySelector('#noteTask').style.display = 'none';
}

// Crea una nueva tarea.
const AddTask = (d) =>{
  let x = document.querySelector('.taskContent');
  let elems, n;

  n = x.children.length;
  
  elems = document.createElement('div');
  elems.setAttribute('class', 'task');
  x.appendChild(elems);

  elems = document.createElement('input');
  elems.setAttribute('type', 'checkbox');
  elems.setAttribute('class', 'task-checkbox');
  elems.setAttribute('name', 'checks');
  elems.value = n;

  checks.forEach(index =>{
    if(index == n)
      elems.setAttribute('checked', '');
  });
  
  x.lastChild.appendChild(elems);
  
  elems = document.createElement('div');
  elems.setAttribute('role', 'textbox');
  elems.setAttribute('class', 'task-content');
  elems.setAttribute('contenteditable', true);
  elems.setAttribute('aria-multiline', true);
  elems.innerHTML = d;
  x.lastChild.appendChild(elems);

  elems.focus();

  elems = document.createElement('i');
  elems.setAttribute('id', `dlt${n}`);
  elems.setAttribute('class', 'task-delete bi bi-x-lg');
  x.lastChild.appendChild(elems);
}

// Elimina una nueva tarea.
const DeleteTask = (x) =>{
  let n = x.id.substring(3,4);
  let task = document.querySelector('.taskContent');
  task.removeChild(task.children[n]);

  SetChecks(n);
  ChangeToNote();
  ChangeToTask();
}

const SetChecks = (x) =>{
  let cBox = document.querySelectorAll('.task-checkbox');
  let j = 0;

  checks = [];
  
  cBox.forEach(e =>{
    if(e.checked == true)
    checks[checks.length] = e.value;
  });
  
  if(!(x == null)){
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == x){
        j = i;
        break;
      }
      else if((j == 0 && (checks[i] > x) || (i + 1) == checks.length))
        j = i;
    }

    for (let i = x; i < cBox.length; i++) {
      if(cBox[i].checked == true){
        checks[j] = cBox[i].value - 1;
        j += 1;
      }
      else if(checks[j] == (cBox[i].value - 1))
        j += 1;

      if ((i + 1) == cBox.length)
        checks.length = j;
    }
  }
}