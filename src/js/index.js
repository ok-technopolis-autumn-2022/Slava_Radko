import Todo from './components/Todo'
import constants from './constants'
import TodoInfo from "./model/TodoInfo";
import {next} from "./generator";

const todoList = document.querySelector(".todo-list")
const input = document.querySelector(".add-form__text")
const form = document.querySelector(".add-form")
const selectAll = document.querySelector(".add-form__select-all")
const count = document.querySelector(".todo-footer__items-count")
const clearCompleted = document.querySelector(".todo-footer__clear")

const radioGroup = document.getElementsByName('switch')

let currentMode = constants.ALL

let todos = []

update()

function filter(it) {
    switch (currentMode) {
        case constants.ALL:
            return true
        case constants.ACTIVE:
            return !it.isDone
        case constants.COMPLETED:
            return it.isDone
    }
}

function update() {
    todos.filter(filter).forEach(todo => {
        addTodoToDOM(todo)
    })
    refreshCount()
}

function clear() {
    todoList.innerHTML = ''
}

export function revertTodos() {
    const checkboxes = todoList.querySelectorAll('.task__checkbox')
    for (let i = 0; i < todos.length; i++) {
        todos[i].isDone = !todos[i].isDone
    }
    for (let checkbox of checkboxes) {
        checkbox.checked = !checkbox.checked
    }
    clear()
    update()
}

export function onCheck(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].isDone = !todos[i].isDone
            refreshCount()
            if (currentMode !== constants.ALL) {
                removeFromTodoInDOM(id)
            }
            return
        }
    }
}

export function onRemove(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos.splice(i, 1)
            refreshCount()
            return
        }
    }
}

export function onChange(id) {
    const popup = document.querySelector(".popup")
    const popupForm = popup.querySelector("form")
    const popupInput = popup.querySelector("input")
    const popupClose = popup.querySelector(".popup-close")

    popup.classList.remove("popup_hidden")

    function removeListeners() {
        popupForm.removeEventListener("submit", callbackOnTextChange)
        popupClose.removeEventListener("click", callbackOnPopupClose)
    }

    function closePopup() {
        popup.classList.add("popup_hidden")
    }

    function callbackOnPopupClose() {
        closePopup()
        removeListeners()
    }

    function callbackOnTextChange(e) {
        e.preventDefault()
        const text = popupInput.value.trim()
        if (text.length > 0) {
            for (let i = 0; i < todoList.children.length; i++) {
                if (Number(todoList.children[i].getAttribute('data-index')) === id) {
                    todoList.children[i].querySelector("label").innerText = text
                    break
                }
            }
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === id) {
                    todos[i].text = text
                    break
                }
            }
            popupInput.value = ''
            closePopup();
            removeListeners();
        }
    }

    popupForm.addEventListener("submit", callbackOnTextChange)
    popupClose.addEventListener("click", callbackOnPopupClose)
}

function removeFromTodoInDOM(id) {
    const children = todoList.children
    for (const item of children) {
        if (Number(item.getAttribute('data-index')) === id) {
            item.remove()
            return
        }
    }
}

function addTodoToDOM(todo) {
    todoList.appendChild(Todo(todo, onCheck, onRemove, onChange))
}

function addTodo(todo) {
    todos.push(todo)
    if (currentMode !== constants.COMPLETED) {
        addTodoToDOM(todo)
    }
    refreshCount()
}

function refreshCount() {
    count.innerHTML = todos.filter(filter).filter(it => !it.isDone).length + ' items left'
}

function onFilterChanged() {
    clear()
    for (let radioGroupElement of radioGroup) {
        if (radioGroupElement.checked) {
            currentMode = radioGroupElement.value
        }
    }
    update()
}

selectAll.addEventListener('click', revertTodos)

form.addEventListener("submit", e => {
    e.preventDefault()
    const value = input.value;
    if (value.trim().length > 0) {
        addTodo(new TodoInfo(next(), value, false))
    }
    input.value = ''
})

radioGroup.forEach(radio => {
    radio.addEventListener('change', onFilterChanged)
})

clearCompleted.addEventListener('click', () => {
    for (let i = 0; i < todos.length;) {
        if (todos[i].isDone) {
            todos.splice(i, 1);
        } else {
            i++;
        }
    }
    clear()
    update()
})