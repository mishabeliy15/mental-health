import {CREATE_TEST_HISTORY, INCREASE_SECONDS, INCREASE_STEP_I} from "../actions/types";

const initialState = {
  stepI: 0,
  seconds: 0,
  testHistoryId: undefined,
};


function processTestReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_TEST_HISTORY:
        return {stepI: 0, seconds: 0, testHistoryId: payload};
    case INCREASE_SECONDS:
        return {...state, seconds: state.seconds + 1};
    case INCREASE_STEP_I:
        return {...state, stepI: state.stepI + 1, seconds: 0};
    default:
      return state;
  }
}

export default processTestReducer;
