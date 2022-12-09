import constants from "../constants";
import TodoItem from "../components/TodoItem";
import State from "../state/State";
import Todo from "../model/Todo";
import { next } from "../generator";

export default class Controller {
  /**
   * @type {Store}
   * */
  #store;
  /**
   * @type {HTMLElement}
   * */
  #root;
  /**
   * @type {State}
   * */
  #state;

  constructor(store, root) {
    this.#store = store;
    this.#root = root;
    this.#state = new State();
  }

  /**
   * Main render method which is the entry point.
   * */
  render = () => {
    const form = document.querySelector(".add-form");
    const selectAll = document.querySelector(".add-form__select-all");
    const clearCompleted = document.querySelector(".todo-footer__clear");

    const radioGroup = document.getElementsByName("switch");

    clearCompleted.addEventListener("click", this.#onClearCompleted);

    selectAll.addEventListener("click", this.#onCompleteAllTodos);

    this.#root.addEventListener("click", this.#onClickRoot);
    this.#root.addEventListener("change", this.#onChangeRoot);

    radioGroup.forEach((radio) => {
      radio.addEventListener("change", this.#onFilterChanged);
    });

    form.addEventListener("submit", this.#onFormSubmit);

    this.#rerender();
  };

  #filter = (it) => {
    switch (this.#state.getCurrentMode()) {
      case constants.ALL:
        return true;
      case constants.ACTIVE:
        return !it.isDone;
      case constants.COMPLETED:
        return it.isDone;
    }
  };

  #rerender = () => {
    this.#clear();
    const todos = this.#store.getData();
    todos.filter(this.#filter).forEach((todo) => {
      this.#addTodoToDOM(todo);
    });
    this.#refreshCount();
  };

  #clear = () => {
    this.#root.innerHTML = "";
  };

  #removeFromTodoInDOM = (id) => {
    document.querySelector(`.todo-list__task[data-index='${id}']`).remove();
  };

  #addTodoToDOM = (todo) => {
    this.#root.appendChild(TodoItem(todo));
  };

  #addTodo = (todo) => {
    this.#store.add(todo);
    if (this.#state.getCurrentMode() !== constants.COMPLETED) {
      this.#addTodoToDOM(todo);
    }
    this.#refreshCount();
  };

  #refreshCount = () => {
    const count = document.querySelector(".todo-footer__items-count");
    count.innerHTML =
      this.#store
        .getData()
        .filter(this.#filter)
        .filter((it) => !it.isDone).length + " items left";
  };

  /* Callbacks of listeners */

  #onFilterChanged = () => {
    const radioGroup = document.getElementsByName("switch");
    this.#clear();
    for (let radioGroupElement of radioGroup) {
      if (radioGroupElement.checked) {
        this.#state.setCurrentMode(radioGroupElement.value);
      }
    }
    this.#rerender();
  };

  #onChangeRoot = (e) => {
    const tag = e.target.tagName.toLowerCase();
    const id = Number(e.target.parentElement.getAttribute("data-index"));
    switch (tag) {
      case "input":
        this.#onCheckTodo(id);
        break;
    }
  };

  #onClickRoot = (e) => {
    const tag = e.target.tagName.toLowerCase();
    const id = Number(e.target.parentElement.getAttribute("data-index"));
    switch (tag) {
      case "button":
        this.#onRemoveTodo(id);
        e.target.parentElement.remove();
        break;
      case "label":
        this.#onChangeTodo(id);
        break;
    }
  };

  #onFormSubmit = (e) => {
    e.preventDefault();
    const input = document.querySelector(".add-form__text");
    const value = input.value;
    if (value.trim().length > 0) {
      this.#addTodo(new Todo(next(), value, false));
    }
    input.value = "";
  };

  #onClearCompleted = () => {
    if (this.#state.getCurrentMode() !== constants.ACTIVE) {
      this.#store.removeIf((todoInfo) => todoInfo.isDone);
    }
    this.#clear();
    this.#rerender();
  };

  #onCompleteAllTodos = () => {
    switch (this.#state.getCurrentMode()) {
      case constants.ALL:
        const isAllDone = this.#store.isAllDone();
        this.#store.updateAll((todoInfo) => ({
          ...todoInfo,
          isDone: !isAllDone,
        }));
        break;
      case constants.COMPLETED:
        this.#store.updateIf(
          (todoInfo) => todoInfo.isDone,
          (todoInfo) => ({ ...todoInfo, isDone: false })
        );
        break;
      case constants.ACTIVE:
        this.#store.updateIf(
          (todoInfo) => !todoInfo.isDone,
          (todoInfo) => ({ ...todoInfo, isDone: true })
        );
        break;
    }
    this.#clear();
    this.#rerender();
  };

  #onCheckTodo = (id) => {
    this.#store.update(id, (todoInfo) => ({
      ...todoInfo,
      isDone: !todoInfo.isDone,
    }));
    if (this.#state.getCurrentMode() !== constants.ALL) {
      this.#removeFromTodoInDOM(id);
    }
    this.#refreshCount();
  };

  #onRemoveTodo = (id) => {
    this.#store.remove(id);
    this.#refreshCount();
  };

  /* Popup management */

  #onChangeTodo = (id) => {
    const popup = document.querySelector(".popup");
    const popupForm = popup.querySelector("form");
    const popupClose = popup.querySelector(".popup-close");

    popup.classList.remove("popup_hidden");

    popupForm.addEventListener("submit", this.#onTextEdit(id));
    popupClose.addEventListener("click", this.#onPopupClose);
  };

  #onPopupClose = () => {
    this.#closePopup();
    this.#removeListenersOnPopup();
  };

  #closePopup = () => {
    const popup = document.querySelector(".popup");
    popup.classList.add("popup_hidden");
  };

  #removeListenersOnPopup = () => {
    const popupForm = document.querySelector(".popup form");
    const popupClose = document.querySelector(".popup.popup-close");
    popupForm.removeEventListener("submit", this.#onTextEdit);
    popupClose.removeEventListener("click", this.#onPopupClose);
  };

  #onTextEdit = (id) => {
    return (e) => {
      const popupInput = document.querySelector(".popup input");
      e.preventDefault();
      const text = popupInput.value.trim();
      if (text.length > 0) {
        document.querySelector(
          `.todo-list__task[data-index='${id}'] label`
        ).innerText = text;
        this.#store.update(id, (todoInfo) => ({ ...todoInfo, text: text }));
        popupInput.value = "";
        this.#closePopup();
        this.#removeListenersOnPopup();
      }
    };
  };
}
