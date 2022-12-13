export class Store {
  /**
   * @type {Object[]}
   * */
  #reducers;
  /**
   * @type {State}
   * */
  #state;

  constructor(reducers, state) {
    this.#reducers = reducers;
    this.#state = state;
  }

  /**
   * @return {State}
   * */
  getState() {
    return this.#state.getCopy();
  }

  /**
   * @param state {State}
   * */
  #setState(state) {
    this.#state = state;
  }

  /**
   * @return {(Action) => void}
   * */
  getDispatch() {
    return (action) => {
      this.#reducers.forEach((it) => {
        this.#setState(it.reduce(this.getState(), action));
      });
    };
  }
}
