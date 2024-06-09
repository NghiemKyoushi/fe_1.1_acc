import {
  fetchBills,
  fetchBillsFailure,
  fetchBillsSuccess,
  fetchFilterBillsFailure,
  fetchFilterBillsPosFeeFailure,
  fetchFilterBillsPosFeeSuccess,
  fetchFilterBillsSuccess,
  fetchSumBillsFailure,
  fetchSumBillsSuccess,
} from "@/actions/BillManagementActions";
import { fetchBill, fetchFilterBill, fetchListModifyPosFee, fetchSumBill } from "@/api/service/billManagement";
import { FETCH_BILL, FETCH_FILTER_BILL, FETCH_FILTER_BILL_POS_FEE, FETCH_SUM_BILL } from "@/constants/BillManagement";
import { enqueueSnackbar } from "notistack";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchBillsListSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchBill, {
      ...action.payload,
    });
    yield put(fetchBillsSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchBillsFailure(e));
  }
}
function* fetchFilterBillsListSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchFilterBill, {
      ...action.payload,
    });
    yield put(fetchFilterBillsSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchFilterBillsFailure(e));
  }
}

function* fetchFilterBillsPosFeeSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchListModifyPosFee, {
      ...action.payload,
    });
    yield put(fetchFilterBillsPosFeeSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchFilterBillsPosFeeFailure(e));
  }
}
function* fetchSumBillsSaga(action: any) {
  try {
    const response: {
      data: {
        total: number;
        totalIntake: number;
        totalPayout: number;
        totalLoan: number;
        totalRepayment: number;
      };
    } = yield call(fetchSumBill, {
      ...action.payload,
    });
    yield put(fetchSumBillsSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchSumBillsFailure(e));
  }
}
function* fetchBillsSaga() {
  yield all([takeLatest(FETCH_BILL, fetchBillsListSaga)]);
  yield all([takeLatest(FETCH_SUM_BILL, fetchSumBillsSaga)]);
  yield all([takeLatest(FETCH_FILTER_BILL, fetchFilterBillsListSaga)]);
  yield all([takeLatest(FETCH_FILTER_BILL_POS_FEE, fetchFilterBillsPosFeeSaga)]);

}

export default fetchBillsSaga;
