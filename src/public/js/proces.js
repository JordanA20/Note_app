const contMdl = document.querySelector('.container');
const contOpt = document.querySelector('.options');
const items = document.querySelector('.items');
let checks = [];


document.addEventListener('DOMContentLoaded', e => {
  CheckKeyUser();
});

const SetKeyUser = (x) => window.localStorage.setItem('keyUser', x);

const GetKeyUser = () => window.localStorage.getItem('keyUser');

// Genera un id aleatorio
const MakeRandomID = (length, 
  dict='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') =>
   Array.from({length}, _=>dict[~~(Math.random()*dict.length)]).join('');

// 
const GetParamKey = () =>
  location.href.substring(location.href.lastIndexOf('/')+1);

// Comprueba si existe una keyUser.
const CheckKeyUser = () => {
  const param = GetParamKey()
  const keyUser = GetKeyUser()
  console.log(keyUser + ' ' + param)
  if(keyUser === null && param != ''){
  console.log(keyUser + ' ' + param)
    location.href = '/';
  }
  else if(keyUser != null && (param === null || param === '')){
  console.log(keyUser + ' ' + param)
    location.href = `/${keyUser}`;
  }
  else if(items.childElementCount < 2 && GetParamKey() != '') {
    if(GetParamKey() === keyUser){
      console.log(param + ' ' + keyUser)
        window.localStorage.removeItem('keyUser');
    }
    location.href = '/';
  }
}

// 
const ValidateKeyUser = async () => {
  try {
    let conf = true;
    if(GetKeyUser() === null) {
      do {
        newkey = MakeRandomID(30);

        const res = await fetch(`/findkey${newkey}`, {
          method: 'post'
        })
        const response = await res.json();
        conf = response.found
      } while (conf);
      SetKeyUser(newkey)
    }
  } catch (error) { alert(error); }
}

// Mostrar el modal de la nota.
items.addEventListener('click', async e => {
  let x = e.target;

  if(!(x.classList.contains('items'))) {
    if(x.parentElement.classList.contains('items-note'))
      x = x.parentElement;
    else if(x.classList.contains('items-bottom'))
      x = x.parentElement.parentElement.children[0];

    SetNote(x);

    if(x.dataset.type == 'task') {
      if(x.dataset.checks.length > 0)
        checks = x.dataset.checks.split(',');
      ChangeToTask();
    }

    contMdl.style.display = 'flex';
  }
});

// Guarda o actualiza la nota y hace desaparecer el modal de la nota.
contMdl.addEventListener('click', async e => {
  let x = e.target;
  let form = document.querySelector('#noteForm');

  if(x.id == 'close' || x.id == 'noteForm') {
    if(document.querySelector('#noteId').value == '') { // Guardar nueva nota o tareas si no estan vacias.
      if(!(document.querySelector('#noteTitle').value == ''
       && document.querySelector('#noteContent').value == '')) { // Si la nota tiene contenido cambia el acction del form para guardarla.
        e.preventDefault()
        await ValidateKeyUser()
        form.action = `/add${GetKeyUser()}`;
      } else // Si esta vacia vulve el metodo get para regresar a inicio sin guardar la nota
        form.method = 'get'
    } else // Actualizar nota.
      form.action = `/update/${(document.querySelector('#noteId').value)}`;
    
    if(document.querySelector('.taskContent').children.length > 0)
      ChangeToNote();
    if(x.id == 'close' || x.id == 'noteForm') // Enviar el formulario si se sale sin utilizar el boton del formulario.
      form.requestSubmit();
      
    contMdl.style.display = 'none';
  }
  else if(x.classList.contains('task-checkbox')){
    if(x.parentElement.children[1].textContent.length > 0)
      SetChecks(null);
    else
      DeleteTask(x.parentElement.children[2]);
  }
  else if(x.id == 'newTask' || x.id == 'lblNewTask')
    AddTask('');
  else if(x.classList.contains('task-delete'))
    DeleteTask(x);
});

// Activar el color hover para el div bottom del item.
items.addEventListener('mouseover', e => {
  let x = e.target;
  let c;
  if(x.classList.contains('items-note')) {
    c = x.dataset.color;
    x.parentElement.children[1].style.backgroundColor = `var(--${c}-hover)`;
    x.parentElement.children[1].children[0].style.backgroundColor = `var(--${c}-hover)`;
  }
  else if(x.classList.contains('items-bottom')) {
    c = x.parentElement.parentElement.children[0].dataset.color;
    x.parentElement.parentElement.children[1].children[0].style.backgroundColor = `var(--${c}-hover)`;
    x.parentElement.parentElement.children[1].style.backgroundColor = `var(--${c}-hover)`;
  }
});

// Desactivar el color hover para el div bottom del item.
items.addEventListener('mouseout', e => {
  let x = e.target;
  let c;
  if(x.classList.contains('items-note')) {
    c = x.dataset.color;
    x.parentElement.children[1].style.backgroundColor = `var(--${c})`;
    x.parentElement.children[1].children[0].style.backgroundColor = `var(--${c})`;
  }
  else if(x.classList.contains('items-bottom')) {
    c = x.parentElement.parentElement.children[0].dataset.color;
    x.parentElement.parentElement.children[1].children[0].style.backgroundColor = `var(--${c})`;
    x.parentElement.parentElement.children[1].style.backgroundColor = `var(--${c})`;
  }
});

// Evento de la barra de opciones de la nota.
contOpt.addEventListener('click', e => {
  let x = e.target;

  if(x.id == 'bgColor') { // Mostar y desaparecer la lista de colores.
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

// Elimina una tarea.
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