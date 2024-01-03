import {
  fetchGenAccBook,
  fetchGenAccBookFailure,
  fetchGenAccBookSuccess,
  fetchGenSumAccBookFailure,
  fetchGenSumAccBookSuccess,
} from "@/actions/GenAccBookActions";

import {
  fetchGenAccountingBook,
  fetchGenSumAccountingBook,
} from "@/api/service/genAccountingBook";
import {
  FETCH_GEN_ACCOUNT_BOOK,
  FETCH_GEN_SUM_ACCOUNT_BOOK,
} from "@/constants/GenAccountBookMamagement";
import { enqueueSnackbar } from "notistack";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchGenAccBookListSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchGenAccountingBook, {
      ...action.payload,
    });
    yield put(fetchGenAccBookSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchGenAccBookFailure(e));
  }
}
function* fetchGenSumAccBookListSaga(action: any) {
  try {
    const response: {
      data: {
        total: number;
        totalIntake: number;
        totalPayout: number;
        totalLoan: number;
        totalRepayment: number;
      };
    } = yield call(fetchGenSumAccountingBook, {
      ...action.payload,
    });
    yield put(fetchGenSumAccBookSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchGenSumAccBookFailure(e));
  }
}
function* fetchGenAccBookSaga() {
  yield all([takeLatest(FETCH_GEN_ACCOUNT_BOOK, fetchGenAccBookListSaga)]);
  yield all([
    takeLatest(FETCH_GEN_SUM_ACCOUNT_BOOK, fetchGenSumAccBookListSaga),
  ]);
}

export default fetchGenAccBookSaga;
