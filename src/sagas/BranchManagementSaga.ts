import { fetchBranchSuccess } from "@/actions/BranchManagementAction";
import { getAllBranch } from "@/api/service/branchManagement";
import { FETCH_BRANCH } from "@/constants/BranchManagement";

import { ColCustomer, CustomerSearchByName } from "@/models/CustomerManager";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchAllBranchSaga(action: any) {
  try {
    const response: { data: CustomerSearchByName[] } = yield call(getAllBranch);
    yield put(fetchBranchSuccess(response?.data));
  } catch (e: any) {}
}

function* branchSaga() {
  yield all([takeLatest(FETCH_BRANCH, fetchAllBranchSaga)]);
}

export default branchSaga;
