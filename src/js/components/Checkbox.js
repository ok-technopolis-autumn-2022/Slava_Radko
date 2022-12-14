export default function Checkbox(id, isDone) {
  const checkbox = document.createElement("input");
  checkbox.classList.add("task__checkbox");
  checkbox.classList.add("checkbox");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.checked = isDone;
  return checkbox;
}
