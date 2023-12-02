// Selecciona los elementos necesarios del DOM
const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

// Inicializa las variables necesarias
let editId, // ID de la tarea que se está editando
isEditTask = false, // Indica si se está editando una tarea
todos = JSON.parse(localStorage.getItem("todo-list")); // Recupera las tareas guardadas en el almacenamiento local

// Añade un evento de clic a cada botón de filtro
filters.forEach(btn => btn.addEventListener("click", () => {
    // Elimina la clase 'active' del botón de filtro actualmente activo
    document.querySelector("span.active").classList.remove("active");
    // Añade la clase 'active' al botón de filtro clickeado
    btn.classList.add("active");
    // Muestra las tareas que coinciden con el filtro seleccionado
    showTodo(btn.id);
}));

// Función para mostrar las tareas
const showTodo = filter => {
    let liTag = ""; // Inicializa la variable que contendrá las etiquetas li
    todos?.forEach(({status, name}, id) => { // Itera sobre cada tarea
        let completed = status == "completed" ? "checked" : ""; // Comprueba si la tarea está completada
        if(filter == status || filter == "all") { // Si el estado de la tarea coincide con el filtro seleccionado o si el filtro es 'all'
            // Añade la tarea a la variable liTag
            liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${name}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
        }
    });
    // Actualiza el contenido del taskBox y el estado del botón clearAll
    taskBox.innerHTML = liTag || `<span>No tienes tareas pendientes</span>`;
    clearAll.classList[todos?.length ? 'add' : 'remove']("active");
    taskBox.classList[taskBox.offsetHeight >= 300 ? 'add' : 'remove']("overflow");
}
showTodo("all"); // Muestra todas las tareas al cargar la página

// Función para mostrar el menú de la tarea
const showMenu = selectedTask => {
    let menuDiv = selectedTask.parentElement.lastElementChild; // Selecciona el menú de la tarea
    menuDiv.classList.add("show"); // Muestra el menú
    document.addEventListener("click", e => { // Añade un evento de clic al documento
        if(e.target.tagName != "I" || e.target != selectedTask) { // Si el clic no fue en el icono del menú o en la tarea seleccionada
            menuDiv.classList.remove("show"); // Oculta el menú
        }
    });
}

// Función para actualizar el estado de una tarea
const updateStatus = selectedTask => {
    let taskName = selectedTask.parentElement.lastElementChild; // Selecciona el nombre de la tarea
    taskName.classList[selectedTask.checked ? 'add' : 'remove']("checked"); // Actualiza la clase del nombre de la tarea
    todos[selectedTask.id].status = selectedTask.checked ? "completed" : "pending"; // Actualiza el estado de la tarea
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Guarda las tareas en el almacenamiento local
}

// Función para editar una tarea
const editTask = (taskId, textName) => {
    editId = taskId; // Guarda el id de la tarea a editar
    isEditTask = true; // Indica que se está editando una tarea
    taskInput.value = textName; // Actualiza el valor del input de la tarea
    taskInput.focus(); // Pone el foco en el input de la tarea
    taskInput.classList.add("active"); // Añade la clase 'active' al input de la tarea
}

// Función para eliminar una tarea
const deleteTask = (deleteId, filter) => {
    isEditTask = false; // Indica que ya no se está editando una tarea
    todos.splice(deleteId, 1); // Elimina la tarea del array de tareas
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Guarda las tareas en el almacenamiento local
    showTodo(filter); // Muestra las tareas que coinciden con el filtro seleccionado
}

// Añade un evento de clic al botón clearAll
clearAll.addEventListener("click", () => {
    isEditTask = false; // Indica que ya no se está editando una tarea
    todos.splice(0, todos.length); // Elimina todas las tareas del array de tareas
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Guarda las tareas en el almacenamiento local
    showTodo(); // Muestra las tareas (que ahora son ninguna)
});

// Añade un evento de keyup al input de la tarea
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim(); // Obtiene la tarea ingresada por el usuario
    if(e.key == "Enter" && userTask) { // Si el usuario presionó Enter y la tarea no está vacía
        if(!isEditTask) { // Si no se está editando una tarea
            todos = todos || []; // Inicializa el array de tareas si es null
            todos.push({name: userTask, status: "pending"}); // Añade la nueva tarea al array de tareas
        } else { // Si se está editando una tarea
            isEditTask = false; // Indica que ya no se está editando una tarea
            todos[editId].name = userTask; // Actualiza el nombre de la tarea
        }
        taskInput.value = ""; // Limpia el input de la tarea
        localStorage.setItem("todo-list", JSON.stringify(todos)); // Guarda las tareas en el almacenamiento local
        showTodo(document.querySelector("span.active").id); // Muestra las tareas que coinciden con el filtro seleccionado
    }
});