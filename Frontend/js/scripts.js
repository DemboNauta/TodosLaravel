document.addEventListener("DOMContentLoaded", () => {
    getTareas();

    let boton = document.getElementById("boton");
    let description = document.getElementById("description");
    let title = document.getElementById("title");

    boton.addEventListener("click", () => {
        createTarea(title.value, description.value);
    });

    title.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            createTarea(title.value, description.value);
        }
    });

    description.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            createTarea(title.value, description.value);
        }
    });

    document.addEventListener("dragstart", ({ target }) => {
        if (target.classList.contains("draggable-item")) {
            dragged = target;
            id = target.id;
            list = target.parentNode.children;
            for (let i = 0; i < list.length; i += 1) {
                if (list[i] === dragged) {
                    index = i;
                }
            }
        }
    });

    document.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    document.addEventListener("drop", ({ target }) => {
        if (target.classList.contains("dropzone") && target.id !== id) {
            dragged.remove();
            for (let i = 0; i < list.length; i += 1) {
                if (list[i] === target) {
                    indexDrop = i;
                }
            }
            if (index > indexDrop) {
                target.before(dragged);
            } else {
                target.after(dragged);
            }
        }
    });
});

function getTareas() {
    fetch("http://localhost:8000/api/tasks")
        .then(response => response.json())
        .then((tasks) => {
            let list = document.getElementById("list");
            let listCompleted = document.getElementById("list-completed");

            list.innerHTML = '';


            
            if (tasks.length === 0) {
                list.innerHTML = '<h3 class="text-center w-fit px-4 py-2 border border-solid border-gray-700 rounded-lg mx-auto">No hay tareas</h3>';
                return;
            }
            

            tasks.forEach(task => {
                let newTask = document.createElement("li");
                newTask.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <h5 class="text-lg">${task.title}</h5>
                            <hr class="h-px mt-2 mb-3 bg-gray-200 border-0 dark:bg-gray-700">

                            <p class="text-sm mt-1">${task.description}</p>
                        </div>
                        <span class="text-red-500 hover:text-red-700 hover:cursor-pointer borrar ml-4 flex items-center">
                            <i class="bi bi-trash"></i>
                        </span>
                    </div>
                `;
                newTask.classList.add("dropzone","shadow-[0_1px_30px_rgba(8,_112,_184,_0.7)]",  "draggable-item", "bg-gradient-to-r", "from-gray-950", "to-gray-800", "hover:from-black", "hover:to-gray-900", "p-3", "rounded-lg", "cursor-pointer", "mb-4", "hover:bg-blue-300", "transition-all", "duration-100", "border-solid", "border-2", "border-black-200", "text-black-300");
                newTask.draggable = true;
                newTask.id = task.id;
                newTask.dataset.title = task.title;
                newTask.dataset.description = task.description;

                list.appendChild(newTask);
                
            });

            document.querySelectorAll(".borrar").forEach(boton => {
                boton.addEventListener("click", () => {
                    fetch(`http://localhost:8000/api/tasks/${boton.closest("li").id}`, {
                        method: "DELETE"
                    }).then(() => {
                        getTareas();
                    });
                });
            });

            document.querySelectorAll("#list-completed .draggable-item").forEach(tarea => {
                tarea.removeEventListener("dblclick", handleDoubleClick);
                tarea.addEventListener("dblclick", handleDoubleClick);

            });

            document.querySelectorAll("#list .draggable-item").forEach(tarea => {
                tarea.removeEventListener("dblclick", handleDoubleClick);
                tarea.addEventListener("dblclick", handleDoubleClick);
                
            });
        });
}

function createTarea(title, description) {
    if (title !== "" || description !== "") {
        fetch("http://localhost:8000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "description": description,
                "startDate": new Date().toISOString(),
                "endDate": new Date().toISOString(),
                "assignedUserId": 0,
                "projectId": 0
            })
        }).then(() => {
            getTareas();
        });
    }
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

function tareaCompletada(id) {
    fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: "update",  
    }).then(() => {
        getTareas();
    });
}

function tareaNoCompletada(tarea) {
    tarea.classList.remove("line-through");
    tarea.classList.add("draggable-item");
    document.getElementById("list").appendChild(tarea);
    createTarea(tarea.dataset.title, tarea.dataset.description);
}

function handleDoubleClick(event) {
    let tarea = event.currentTarget;
    if (tarea.classList.contains("line-through")) {
        tareaNoCompletada(tarea);
    } else {
        tareaCompletada(tarea.id);
        tarea.classList.add("line-through");
        tarea.classList.remove("bg-gray-700");
        tarea.classList.remove("shadow-[0_1px_30px_rgba(8,_112,_184,_0.7)]");
        tarea.classList.add("bg-gray-800");
        tarea.classList.add("shadow-[0_5px_10px_rgba(8,_112,_184,_0.7)]");
        document.getElementById("list-completed").appendChild(tarea);
    }
}
