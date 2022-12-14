import ActionType from "../actions/ActionType";
import Mode from "../store/Mode";

/**
 * @param state {State}
 * @param action {Action}
 * @return {State}
 * */
export default function removeReducer(state, action) {
  switch (action.type) {
    case ActionType.CLEAR_COMPLETED:
      if (state.getCurrentMode() !== Mode.ACTIVE) {
        const todos = state.getCurrentTodos();
        for (let todo of todos) {
          if (todo.isDone) {
            state.removeById(todo.id);
          }
        }
      }
      break;
    case ActionType.REMOVE:
      const id = action.payload?.value;
      state.removeById(id);
      break;
  }
  return state;
}
