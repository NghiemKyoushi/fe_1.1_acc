import { all, fork } from "redux-saga/effects";

import authSaga from "../store/auth/saga";
import invoiceSaga from "./InvoiceMangementSaga";
export function* rootSaga() {
  yield all([fork(authSaga)]);
  yield all([fork(invoiceSaga)]);

}