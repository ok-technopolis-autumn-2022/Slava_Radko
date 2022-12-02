import Todo from './components/Todo'
import constants from './constants'
import TodoInfo from "./model/TodoInfo";
import {next} from "./generator";
import {Store} from "./store/store";

const todoList = document.querySelector(".todo-list")
const input = document.querySelector(".add-form__text")
const form = document.querySelector(".add-form")
const selectAll = document.querySelector(".add-form__select-all")
const count = document.querySelector(".todo-footer__items-count")
const clearCompleted = document.querySelector(".todo-footer__clear")

const radioGroup = document.getElementsByName('switch')

let currentMode = constants.ALL

const store = new Store()

render()

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

function render() {
    clear()
    const todos = store.getData()
    todos.filter(filter).forEach(todo => {
        addTodoToDOM(todo)
    })
    refreshCount()
}

function clear() {
    todoList.innerHTML = ''
}

export function invertTodos() {
    switch (currentMode) {
        case constants.ALL:
            const isAllDone = store.isAllDone()
            store.updateAll(todoInfo => ({...todoInfo, isDone: !isAllDone}))
            break
        case constants.COMPLETED:
            store.updateIf(todoInfo => todoInfo.isDone, todoInfo => ({...todoInfo, isDone: false}))
            break
        case constants.ACTIVE:
            store.updateIf(todoInfo => !todoInfo.isDone, todoInfo => ({...todoInfo, isDone: true}))
            break
    }
    clear()
    render()
}

export function onCheck(id) {
    store.update(id, todoInfo => ({...todoInfo, isDone: !todoInfo.isDone}))
    if (currentMode !== constants.ALL) {
        removeFromTodoInDOM(id)
    }
    refreshCount()
}

export function onRemove(id) {
    store.remove(id)
    refreshCount()
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
            document.querySelector(`.todo-list__task[data-index='${id}'] label`).innerText = text
            store.update(id, todoInfo => ({...todoInfo, text: text}))
            popupInput.value = ''
            closePopup();
            removeListeners();
        }
    }

    popupForm.addEventListener("submit", callbackOnTextChange)
    popupClose.addEventListener("click", callbackOnPopupClose)
}

function removeFromTodoInDOM(id) {
    document.querySelector(`.todo-list__task[data-index='${id}']`).remove()
}

function addTodoToDOM(todo) {
    todoList.appendChild(Todo(todo, onCheck, onRemove, onChange))
}

function addTodo(todo) {
    store.add(todo)
    if (currentMode !== constants.COMPLETED) {
        addTodoToDOM(todo)
    }
    refreshCount()
}

function refreshCount() {
    count.innerHTML = store.getData().filter(filter).filter(it => !it.isDone).length + ' items left'
}

function onFilterChanged() {
    clear()
    for (let radioGroupElement of radioGroup) {
        if (radioGroupElement.checked) {
            currentMode = radioGroupElement.value
        }
    }
    render()
}

selectAll.addEventListener('click', invertTodos)

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
    if (currentMode !== constants.ACTIVE) {
        store.removeIf(todoInfo => todoInfo.isDone)
    }
    clear()
    render()
})