import { fetchSearchCustomerSuccess } from "@/actions/CustomerManagerAction";
import { fetchPosManagementSuccess } from "@/actions/PosManagementActions";
import { fetchPosManagementSearch } from "@/api/service/posManagerApis";
import { FETCH_POS_MANAGEMENT } from "@/constants/PosManagement";
import { CustomerSearchByName } from "@/models/CustomerManager";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchPosmmManagementSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchPosManagementSearch, {
      ...action.payload,
    });
    yield put(fetchPosManagementSuccess(response?.data));
  } catch (e: any) {}
}

function* posManagermentSaga() {
  yield all([takeLatest(FETCH_POS_MANAGEMENT, fetchPosmmManagementSaga)]);
}

export default posManagermentSaga;
