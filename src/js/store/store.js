import TodoInfo from "../model/TodoInfo";

export class Store {
    /**
     * @type {TodoInfo[]}
     **/
    #todos

    constructor() {
        this.#todos = []
    }

    /**
     * Returns item index by id from store
     * @param id {number}
     * @return {number}
     **/
    #getIndex(id) {
        return this.#todos.indexOf(this.#todos.find(value => value.id === id))
    }

    /**
    * Adds item to the store
    * @param todo {TodoInfo}
    **/
    add(todo) {
        this.#todos.push(todo)
    }

    /**
    * Returns item by id from the store
    * @param id {number}
    * @return {TodoInfo}
    **/
    get(id) {
        const index = this.#getIndex(id)
        if (index === -1) return null
        return this.#todos[index]
    }

    /**
     * Updates item by id in the store
     * @param id {number}
     * @param callback {(TodoInfo) => TodoInfo}
     * @return {Boolean}
     **/
    update(id, callback) {
        const index = this.#getIndex(id)
        if (index === -1) return false
        this.#todos[index] = callback(this.#todos[index])
        return true
    }

    /**
     * Updates all items in the store
     * @param callback {(TodoInfo) => TodoInfo}
     **/
    updateAll(callback) {
        for (let i = 0; i < this.#todos.length; i++) {
            this.#todos[i] = callback(this.#todos[i])
        }
    }

    /**
     * Updates items which satisfy predicate condition in the store
     * @param predicate {(TodoInfo) => boolean}
     * @param callback {(TodoInfo) => TodoInfo}
     **/
    updateIf(predicate, callback) {
        for (let i = 0; i < this.#todos.length; i++) {
            if (predicate(this.#todos[i])) {
                this.#todos[i] = callback(this.#todos[i])
            }
        }
    }

    /**
     * Removes item by id from the store
     * @param id {number}
     * @return {Boolean}
     **/
    remove(id) {
        const index = this.#getIndex(id)
        if (index === -1) return false
        this.#todos.splice(index, 1)
        return true
    }

    /**
     * Removes items which satisfy predicate condition in the store
     * @param predicate {(TodoInfo) => boolean}
     **/
    removeIf(predicate) {
        for (let i = 0; i < this.#todos.length;) {
            if (predicate(this.#todos[i])) {
                this.#todos.splice(i, 1)
            } else {
                i++
            }
        }
    }

    /**
     * Returns copy of store data
     * @return {TodoInfo[]}
     **/
    getData() {
        return JSON.parse(JSON.stringify(this.#todos))
    }

    /**
     * Returns size of the store
     * @return {number}
     **/
    getSize() {
        return this.#todos.length
    }

    /**
     * Checks if everything is done
     * @return {Boolean}
     **/
    isAllDone() {
        for (let todo of this.#todos) {
            if (!todo.isDone) {
                return false
            }
        }
        return true
    }
}