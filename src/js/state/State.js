import constants from "../constants";

export default class State {
  /**
   * @type {string}
   * */
  #currentMode;

  constructor() {
    this.#currentMode = constants.ALL;
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
}
