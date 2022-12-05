import Checkbox from "./Checkbox";
import Label from "./Label";
import Button from "./Button";

export default function Todo(todo, onCheck, onRemove, onChange) {
    const li = document.createElement('li')
    const checkbox = Checkbox(todo.id, todo.isDone)
    const button = Button(todo.id, todo.text)
    const label = Label(todo.id, todo.text)

    const callbackOnChange = e => {
        const tag = e.target.tagName.toLowerCase()
        switch (tag) {
            case 'input':
                onCheck(todo.id)
                break
        }
    }

    const callbackOnClick = e => {
        const tag = e.target.tagName.toLowerCase()
        switch (tag) {
            case 'button':
                li.remove()
                onRemove(todo.id)
                li.removeEventListener('click', callbackOnClick)
                li.removeEventListener('change', callbackOnChange)
                break
            case 'label':
                onChange(todo.id)
                break
        }
    }

    li.classList.add('todo-list__task')
    li.classList.add('task')

    li.setAttribute("data-index", todo.id)

    li.addEventListener('click', callbackOnClick)
    li.addEventListener('change', callbackOnChange)

    li.append(checkbox)
    li.append(label)
    li.append(button)

    return li
}