import ActionType from "../actions/ActionType";

/**
 * @param state {State}
 * @param action {Action}
 * @return {State}
 * */
export default function addReducer(state, action) {
    switch (action.type) {
        case ActionType.ADD_TODO:
            const todos = state.getAllTodos()
            todos.push(action.payload?.value)
            state.setTodos(todos);
             break
    }
    return state
}