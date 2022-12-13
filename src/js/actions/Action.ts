export default class Action {
    /**
     * @type {string}
     * */
    type;
    /**
     * @type {{value: Object}}
     * */
    payload;

    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
};