import ActionType from "../actions/ActionType";
import Mode from "../store/Mode";

/**
 * @param state {State}
 * @param action {Action}
 * @return {State}
 * */
export default function changeReducer(state, action) {
  switch (action.type) {
    case ActionType.MODE_CHANGED:
      state.setCurrentMode(action.payload?.value);
      break;
    case ActionType.CHANGE_TEXT:
      if (
        action.payload?.value.hasOwnProperty("id") &&
        action.payload?.value.hasOwnProperty("text")
      ) {
        const id = action.payload.value.id;
        const text = action.payload.value.text;

        const todo = state.getById(id);
        state.update({ ...todo, text: text });
      }
      break;
    case ActionType.CHECK:
      if (action.payload?.value.hasOwnProperty("id")) {
        const id = action.payload.value.id;

        const todo = state.getById(id);

        state.update({ ...todo, isDone: !todo.isDone });
      }
      break;
    case ActionType.COMPLETE_ALL:
      if (state.getCurrentMode() !== Mode.COMPLETED) {
        const currentTodos = state.getCurrentTodos();

        for (let currentTodo of currentTodos) {
          if (!currentTodo.isDone) {
            state.update({ ...currentTodo, isDone: true });
          }
        }
      }
  }
  return state;
}
