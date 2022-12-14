export default function Button(id, text) {
  const button = document.createElement("button");
  button.classList.add("task__remove");
  button.title = "Remove task";
  return button;
}
