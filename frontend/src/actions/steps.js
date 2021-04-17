import StepService from "../services/step.service";
import {DELETE_TEST_STEP, RELOAD_TEST_STEP} from "./types";


export const editStep = (id, inputData) => (dispatch) =>
  StepService.patchStep(inputData).then((data) => {
    dispatch({type: RELOAD_TEST_STEP, payload: {id, data}});
    return Promise.resolve();
  });

export const addStep = (id, inputData) => (dispatch) =>
  StepService.createStep(inputData).then((data) => {
    dispatch({type: RELOAD_TEST_STEP, payload: {id, data}});
    return Promise.resolve();
  });

export const deleteStep = (id) => (dispatch) =>
  StepService.deleteStep(id).then(() => {
    dispatch({type: DELETE_TEST_STEP, payload: id});
    return Promise.resolve();
  });
