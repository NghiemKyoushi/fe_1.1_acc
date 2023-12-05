import { all, fork } from "redux-saga/effects";

import authSaga from "../store/auth/saga";
import invoiceSaga from "./InvoiceMangementSaga";
import customerSaga from "./CustomerManagementSaga";
import cardCustomerSaga from "./CardCustomerSaga";
import posManagermentSaga from "./PosManagementSaga";
import empManagermentSaga from "./EmpManagementSaga";
import fetchAccBookSaga from "./AccBookSaga";
import fetchGenAccBookSaga from "./GenAccBookSaga";
export function* rootSaga() {
  yield all([fork(authSaga)]);
  yield all([fork(invoiceSaga)]);
  yield all([fork(customerSaga)]);
  yield all([fork(posManagermentSaga)]);
  yield all([fork(cardCustomerSaga)]);
  yield all([fork(empManagermentSaga)]);
  yield all([fork(fetchAccBookSaga)]);
  yield all([fork(fetchGenAccBookSaga)]);
}
