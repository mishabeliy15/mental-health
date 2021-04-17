import {
  ADD_TEST_STEP,
  DELETE_TEST_STEP,
  EDIT_TEST,
  EDIT_TEST_STEP,
  GET_TEST_DETAIL,
  RELOAD_TEST_STEP
} from "../actions/types";

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
    case EDIT_TEST_STEP:
      const test_step = {...state.steps[payload.id]};
      test_step[payload.name] = payload.value;
      state.steps[payload.id] = test_step;
      return {...state};
    case RELOAD_TEST_STEP:
      state.steps[payload.id] = payload.data;
      return {...state};
    case ADD_TEST_STEP:
      state.steps.push(payload);
      return {...state};
    case DELETE_TEST_STEP:
      const steps = state.steps.filter((step) => step.id !== payload);
      return {...state, steps};
    default:
      return state;
  }
}

export default testReducer;
