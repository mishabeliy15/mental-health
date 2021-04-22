import { combineReducers } from "redux";
import auth from "./auth";
import { routerReducer } from "react-router-redux";
import message from "./message";
import common from "./common";
import category from "./category";
import test from "./test";
import processTest from "./processTest";

export default combineReducers({
  routing: routerReducer,
  auth,
  message,
  common,
  category,
  test,
  processTest,
});
