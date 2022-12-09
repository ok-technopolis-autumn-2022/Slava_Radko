import Checkbox from "./Checkbox";
import Label from "./Label";
import Button from "./Button";

export default function TodoItem(todo) {
  const li = document.createElement("li");
  const checkbox = Checkbox(todo.id, todo.isDone);
  const button = Button(todo.id, todo.text);
  const label = Label(todo.id, todo.text);

  li.classList.add("todo-list__task");
  li.classList.add("task");

  li.setAttribute("data-index", todo.id);

  li.append(checkbox);
  li.append(label);
  li.append(button);

  return li;
}
