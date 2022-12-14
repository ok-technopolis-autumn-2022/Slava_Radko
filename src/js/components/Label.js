export default function Label(id, text) {
  const label = document.createElement("label");
  label.for = "";
  label.innerText = text;
  return label;
}
