import { all } from "redux-saga/effects";
import userSaga from "./userSaga";
import postSaga from "./postSaga";

export default function* rootSaga() {
  console.log("rootsaga");
  yield all([userSaga(), postSaga()]);
}
