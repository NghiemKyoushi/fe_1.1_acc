import {
  fetchAccBookFailure,
  fetchAccBookSuccess,
  fetchSumAccBookFailure,
  fetchSumAccBookSuccess,
} from "@/actions/AccBookActions";

import {
  fetchAccountingBook,
  fetchSumAccountingBook,
} from "@/api/service/accountingBook";
import {
  FETCH_ACCOUNT_BOOK,
  FETCH_SUM_ACCOUNT_BOOK,
} from "@/constants/AccountBookMamagement";
import { enqueueSnackbar } from "notistack";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchAccBookListSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchAccountingBook, {
      ...action.payload,
    });
    yield put(fetchAccBookSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchAccBookFailure(e));
  }
}
function* fetchSumAccBookListSaga(action: any) {
  try {
    const response: {
      data: {
        total: number;
        totalIntake: number;
        totalPayout: number;
        totalLoan: number;
        totalRepayment: number;
      };
    } = yield call(fetchSumAccountingBook, {
      ...action.payload,
    });
    yield put(fetchSumAccBookSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchSumAccBookFailure(e));
  }
}
function* fetchAccBookSaga() {
  yield all([takeLatest(FETCH_ACCOUNT_BOOK, fetchAccBookListSaga)]);
  yield all([takeLatest(FETCH_SUM_ACCOUNT_BOOK, fetchSumAccBookListSaga)]);
}

export default fetchAccBookSaga;
