import {
  SET_CURRENT_TODO,
  SET_TODO_TO_ADD,
  SET_SEARCH_TITLE,
  SET_CURRENT_INDEX,
  SET_MESSAGE,
  SET_SUBMITTED,
  SET_TODOS,
  IS_FETCHING,
  IS_ADDING,
  IS_DELETING,
  IS_DELETING_ALL,
  IS_FINDING,
  IS_UPDATING,
  API_ERRORED,
  // GET_TODOS_SUCCESSFUL,
  DELETE_TODOS_SUCCESSFUL,
  UPDATE_TODO,
  UPDATE_TODO_SUCCESSFUL,
  DELETE_TODO,
  DELETE_TODO_SUCCESSFUL,
  ADD_TODO,
  ADD_TODO_SUCCESSFUL,
  // FIND_BY_TITLE_SUCCESSFUL,
} from "../constants/action.types";
import { deepCopy } from '../utils';

export const initialState = {
  todos: [],
  currentTodo: null,
  todoToAdd: null,
  searchTitle: "",
  currentIndex: -1,
  message: "",
  submitted: false,
  error: '',
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  isDeletingAll: false,
  isFinding: false,
};

function rootReducer(state = initialState, action) {
  let mappings = null;

  switch (action.type) {
    case SET_CURRENT_TODO:
      if (!action.payload) return { ...state, currentTodo: null };
      return {
        ...state,
        currentTodo: { ...state.currentTodo, ...action.payload }
      };

    case SET_TODO_TO_ADD:
      if (!action.payload) return { ...state, todoToAdd: null };
      return { ...state, todoToAdd: action.payload };

    case SET_SEARCH_TITLE:
      return { ...state, searchTitle: action.payload };

    // case FIND_BY_TITLE_SUCCESSFUL:
    //   return { ...state, isFinding: false, todos: action.payload };

    case SET_CURRENT_INDEX:
      return { ...state, currentIndex: action.payload };

    case SET_MESSAGE:
      return { ...state, message: action.payload };

    case SET_SUBMITTED:
      return { ...state, submitted: action.payload };

    case SET_TODOS:
      return { ...state, todos: action.payload };

    // case GET_TODOS_SUCCESSFUL:
    //   return { ...state, isLoading: false, todos: action.payload };

    case ADD_TODO:
      return { ...state, isAdding: true, todos: state.todos.concat(action.payload) };

    case ADD_TODO_SUCCESSFUL:
      return { ...state, isAdding: false };

    case UPDATE_TODO:
      mappings = deepCopy(state.todos);
      const idx = mappings.findIndex((t) => t._id === action.payload._id);
      if (mappings && mappings[idx]) {
        let todo = action.payload;
        todo.dueDate = todo.dueDate.toISOString();
        delete todo.id;
        mappings[idx] = { ...mappings[idx], ...todo };
      }
      return { ...state, isUpdating: true, todos: mappings };

    case UPDATE_TODO_SUCCESSFUL:
      return { ...state, isUpdating: false};

    case DELETE_TODO:
      mappings = state.todos.filter((t) => t._id !== action.payload._id);
      return { ...state, isDeleting: false, todos: mappings };

    case DELETE_TODO_SUCCESSFUL:
      return { ...state, isDeleting: false};

    case DELETE_TODOS_SUCCESSFUL:
      return { ...state, isDeletingAll: false, todos: action.payload };

    case IS_FETCHING:
      return { ...state, isLoading: action.payload };

    case IS_ADDING:
      return { ...state, isAdding: true };

    case IS_UPDATING:
      return { ...state, isUpdating: true };

    case IS_DELETING:
      return { ...state, isDeleting: true };

    case IS_DELETING_ALL:
      return { ...state, isDeletingAll: true };

    case IS_FINDING:
      return { ...state, isFinding: true };

    case API_ERRORED:
      // return { ...state, error: state.error = 'yes' }
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

export default rootReducer;
