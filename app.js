const submitForm = document.querySelector("#form-submit");
const todoListUL = document.querySelector("#todo-list");

submitForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const todoElement = ev.target[0].value;

  createTodoListElement(todoElement);
  ev.target.reset();
});

function createTodoListElement(todo) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo, completed: false }),
  };
  fetch(`http://localhost:3000/todos`, opts)
    .then((res) => res.json())
    .then((newTodo) => {
      console.log(newTodo);
      const li = document.createElement("li");
      li.innerText = newTodo.title;
      todoListUL.append(li);
      render();
    });
}

function clearToDoList() {
  todoListUL.innerHTML = "";
}

function render() {
  clearToDoList();

  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((todo) => {
        const todoListLI = document.createElement("li");
        todoListLI.innerText = todo.title;

        const completeBUTTON = document.createElement("button");
        completeBUTTON.innerText = "✔︎";

        const deleteBUTTON = document.createElement("button");
        deleteBUTTON.innerText = "delete";

        todoListLI.append(completeBUTTON, deleteBUTTON);
        todoListUL.append(todoListLI);

        deleteBUTTON.addEventListener("click", () => {
          fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then(() => {
              todoListLI.remove();
            });
        });

        completeBUTTON.addEventListener("click", () => {
          const opts = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          };
          fetch(`http://localhost:3000/todos/${todo.id}`, opts)
            .then((res) => res.json())
            .then((todo) => {
              if (todo.completed) todoListLI.setAttribute("class", "completed");
            });
        });
      });
    });
}
render();
