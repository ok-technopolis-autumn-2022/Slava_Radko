import Checkbox from "./Checkbox";
import Label from "./Label";
import Button from "./Button";

export default function Todo(todo, onCheck, onRemove, onChange) {
    const li = document.createElement('li')
    const checkbox = Checkbox(todo.id, todo.isDone)
    const button = Button(todo.id, todo.text)
    const label = Label(todo.id, todo.text)

    const callbackOnChange = () => {
        onCheck(todo.id)
    }

    const callbackOnClick = () => {
        onChange(todo.id)
    }

    const callbackOnRemove = () => {
        li.remove()
        onRemove(todo.id)
        checkbox.removeEventListener('change', callbackOnChange)
        button.removeEventListener('click', callbackOnRemove)
        label.removeEventListener('click', callbackOnClick)
    }

    li.classList.add('todo-list__task')
    li.classList.add('task')

    li.setAttribute("data-index", todo.id)

    checkbox.addEventListener('change', callbackOnChange)
    li.addEventListener('click', e => {
        const tag = e.target.tagName.toLowerCase()
        switch (tag) {
            case 'button':
                callbackOnRemove()
                break
            case 'label':
                callbackOnClick()
        }
    })

    li.append(checkbox)
    li.append(label)
    li.append(button)

    return li
}