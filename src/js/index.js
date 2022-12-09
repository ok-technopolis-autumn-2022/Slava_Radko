import { Store } from "./store/store";
import Controller from "./controller/Controller";

const root = document.querySelector(".todo-list");
const store = new Store();

const controller = new Controller(store, root);

controller.render();
