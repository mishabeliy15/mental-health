import {EDIT_TEST, GET_TEST_DETAIL} from "../actions/types";

const initialState = {
  "id": null,
  "owner": {},
  "steps": [],
  "created": null,
  "updated": null,
  "name": "",
  "language": "",
  "description": "",
  "normal_mse": 1.0,
  "category": 1
};

function testReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TEST_DETAIL:
      return {...payload};
    case EDIT_TEST:
      return {...state, ...payload};
    default:
      return state;
  }
}

export default testReducer;
