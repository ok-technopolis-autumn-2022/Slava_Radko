import Todo from "../model/Todo";

export class Store {
  /**
   * @type {Todo[]}
   **/
  #todos;

  constructor() {
    this.#todos = [];
  }

  /**
   * Returns item index by id from store
   * @param id {number}
   * @return {number}
   **/
  #getIndex(id) {
    return this.#todos.indexOf(this.#todos.find((value) => value.id === id));
  }

  /**
   * Adds item to the store
   * @param todo {Todo}
   **/
  add(todo) {
    this.#todos.push(todo);
  }

  /**
   * Returns item by id from the store
   * @param id {number}
   * @return {Todo}
   **/
  get(id) {
    const index = this.#getIndex(id);
    if (index === -1) return null;
    return this.#todos[index];
  }

  /**
   * Updates item by id in the store
   * @param id {number}
   * @param callback {(Todo) => Todo}
   * @return {Boolean}
   **/
  update(id, callback) {
    const index = this.#getIndex(id);
    if (index === -1) return false;
    this.#todos[index] = callback(this.#todos[index]);
    return true;
  }

  /**
   * Updates all items in the store
   * @param callback {(Todo) => Todo}
   **/
  updateAll(callback) {
    for (let i = 0; i < this.#todos.length; i++) {
      this.#todos[i] = callback(this.#todos[i]);
    }
  }

  /**
   * Updates items which satisfy predicate condition in the store
   * @param predicate {(Todo) => boolean}
   * @param callback {(Todo) => Todo}
   **/
  updateIf(predicate, callback) {
    for (let i = 0; i < this.#todos.length; i++) {
      if (predicate(this.#todos[i])) {
        this.#todos[i] = callback(this.#todos[i]);
      }
    }
  }

  /**
   * Removes item by id from the store
   * @param id {number}
   * @return {Boolean}
   **/
  remove(id) {
    const index = this.#getIndex(id);
    if (index === -1) return false;
    this.#todos.splice(index, 1);
    return true;
  }

  /**
   * Removes items which satisfy predicate condition in the store
   * @param predicate {(Todo) => boolean}
   **/
  removeIf(predicate) {
    for (let i = 0; i < this.#todos.length; ) {
      if (predicate(this.#todos[i])) {
        this.#todos.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  /**
   * Returns copy of store data
   * @return {Todo[]}
   **/
  getData() {
    return JSON.parse(JSON.stringify(this.#todos));
  }

  /**
   * Returns size of the store
   * @return {number}
   **/
  getSize() {
    return this.#todos.length;
  }

  /**
   * Checks if everything is done
   * @return {Boolean}
   **/
  isAllDone() {
    for (let todo of this.#todos) {
      if (!todo.isDone) {
        return false;
      }
    }
    return true;
  }
}
