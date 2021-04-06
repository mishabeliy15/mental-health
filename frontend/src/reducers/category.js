import {UPDATE_CATEGORIES_LIST} from "../actions/types";

const initialState = [];

function categoryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_CATEGORIES_LIST:
      return payload.slice();
    default:
      return state;
  }
}

export default categoryReducer;
