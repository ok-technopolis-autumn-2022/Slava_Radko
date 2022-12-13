import { Store } from "./store/Store";
import Controller from "./controller/Controller";
import addReducer from "./reducers/AddReducer";
import changeReducer from "./reducers/ChangeReducer";
import removeReducer from "./reducers/RemoveReducer";
import State from "./store/State";

const root = document.querySelector(".todo-list");
const store = new Store(
    [
        addReducer,
        changeReducer,
        removeReducer
    ],
    new State()
);

const controller = new Controller(store, root);

controller.render();
