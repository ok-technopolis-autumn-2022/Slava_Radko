import Mode from "./Mode";

export default class State {
  /**
   * @type {string}
   * */
  #currentMode;
  /**
   * @type {Todo[]}
   **/
  #todos;

  constructor() {
    this.#currentMode = Mode.ALL;
    this.#todos = [];
  }

  /**
   * Returns item index by id from store
   * @param id {number}
   * @return {number}
   **/
  getIndex(id) {
    return this.#todos.indexOf(this.#todos.find((value) => value.id === id));
  }

  /**
   * @return {string}
   * */
  getCurrentMode() {
    return this.#currentMode;
  }

  /**
   * @param mode {string}
   * */
  setCurrentMode(mode) {
    this.#currentMode = mode;
  }

  /**
   * Returns todos depending on current mode
   * @return {Todo[]}
   **/
  getAllTodos() {
    return this.#todos;
  }

  /**
   * Returns todos depending on current mode
   * @return {Todo[]}
   **/
  getCurrentTodos() {
    switch (this.#currentMode) {
      case Mode.ALL:
        return this.#todos;
      case Mode.ACTIVE:
        return this.#todos.filter((it) => !it.isDone);
      case Mode.COMPLETED:
        return this.#todos.filter((it) => it.isDone);
    }
    return null;
  }

  /**
   * @param todos {Todo[]}
   * */
  setTodos(todos) {
    this.#todos = todos;
  }

  /**
   * @return {number}
   * */
  getActiveCount() {
    switch (this.#currentMode) {
      case Mode.ALL:
        return this.getCurrentTodos().filter((it) => it.isDone).length;
      case Mode.ACTIVE:
        return this.getCurrentTodos().length;
      case Mode.COMPLETED:
        return 0;
    }
    return 0;
  }

  /**
   * Returns item by id from the store
   * @param id {number}
   * @return {Todo}
   **/
  getById(id) {
    const index = this.getIndex(id);
    if (index === -1) return null;
    return this.#todos[index];
  }

  /**
   * @return {State}
   * */
  getCopy() {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * @param todo {Todo}
   * */
  update(todo) {
    const index = this.getIndex(todo.id);
    this.#todos[index] = todo;
  }

  /**
   * @param id {number}
   * */
  removeById(id) {
    const index = this.getIndex(id);
    this.#todos.splice(index, 1);
  }
}
