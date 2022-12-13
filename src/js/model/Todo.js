export default class Todo {
  /**
   * @type {number}
   * */
  id;
  /**
   * @type {string}
   * */
  text;
  /**
   * @type {boolean}
   * */
  isDone;

  constructor(id, text, isDone) {
    this.id = id;
    this.text = text;
    this.isDone = isDone;
  }
};
