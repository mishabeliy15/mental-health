import TestHistoryService from "./../services/testHistory.service";
import {CREATE_TEST_HISTORY} from "./types";

export const createTestHistory = (testId) => (dispatch) =>
  TestHistoryService.createTestHistory(testId)
    .then((testHistory) => {
      dispatch({type: CREATE_TEST_HISTORY, payload: testHistory.id});
      return Promise.resolve();
    });