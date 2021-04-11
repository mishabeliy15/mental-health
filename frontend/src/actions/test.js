import {CLEAR_MESSAGE, EDIT_TEST, GET_TEST_DETAIL, SET_MESSAGE, UPDATE_CATEGORIES_LIST} from "./types";
import TestService from "./../services/test.service";


export const createTest = (data) => (dispatch) =>
  TestService.createTest(data)
    .then(() => {
      dispatch({type: CLEAR_MESSAGE});
      return Promise.resolve();
    })
    .catch((error) => {
      dispatch({type: SET_MESSAGE, payload: error.response.data});
      return Promise.reject();
    });

export const updateCategories = () => (dispatch) =>
  TestService.getCategories().then((categories) => {
    dispatch({type: UPDATE_CATEGORIES_LIST, payload: categories});
    return Promise.resolve();
  });

export const getTestDetail = (id) => (dispatch) =>
  TestService.getTestDetail(id).then((data) => {
    dispatch({type: GET_TEST_DETAIL, payload: data});
    return Promise.resolve();
  });

export const editTest = (data) => (dispatch) =>
  TestService.patchTest(data).then((data) => {
    dispatch({type: EDIT_TEST, payload: data});
    return Promise.resolve();
  });