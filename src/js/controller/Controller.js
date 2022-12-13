import Mode from "../store/Mode";
import TodoItem from "../components/TodoItem";
import Todo from "../model/Todo";
import { next } from "../generator";
import Action from "../actions/Action";
import ActionType from "../actions/ActionType";

export default class Controller {
  /**
   * @type {Store}
   * */
  #store;
  /**
   * @type {HTMLElement}
   * */
  #root;
  #dispatch;

  constructor(store, root) {
    this.#store = store;
    this.#root = root;
    this.#dispatch = store.getDispatch();
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

  #rerender = () => {
    this.#clear();
    this.#store.getState().getCurrentTodos().forEach((todo) => {
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
    this.#dispatch(new Action(ActionType.ADD_TODO, {value: todo}))
    if (this.#store.getState().getCurrentMode() !== Mode.COMPLETED) {
      this.#addTodoToDOM(todo);
    }
    this.#refreshCount();
  };

  #refreshCount = () => {
    const count = document.querySelector(".todo-footer__items-count");
    count.innerHTML = this.#store.getState().getActiveCount() + " items left";
  };

  /* Callbacks of listeners */

  #onFilterChanged = () => {
    const radioGroup = document.getElementsByName("switch");
    this.#clear();
    for (let radioGroupElement of radioGroup) {
      if (radioGroupElement.checked) {
        this.#dispatch(ActionType.MODE_CHANGED, {value: radioGroupElement.value})
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
    if (this.#store.getState().getCurrentMode() !== Mode.ACTIVE) {
      this.#dispatch(ActionType.CLEAR_COMPLETED);
    }
    this.#clear();
    this.#rerender();
  };

  #onCompleteAllTodos = () => {
    this.#dispatch(ActionType.COMPLETE_ALL)
    this.#clear();
    this.#rerender();
  };

  #onCheckTodo = (id) => {
    this.#dispatch(ActionType.CHECK, {value: id})
    if (this.#store.getState().getCurrentMode() !== Mode.ALL) {
      this.#removeFromTodoInDOM(id);
    }
    this.#refreshCount();
  };

  #onRemoveTodo = (id) => {
    this.#dispatch(ActionType.REMOVE, {value: id});
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
        this.#dispatch(ActionType.CHANGE_TEXT, {value: {id, text}})
        popupInput.value = "";
        this.#closePopup();
        this.#removeListenersOnPopup();
      }
    };
  };
}
