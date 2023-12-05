import {
  fetchAccBookFailure,
  fetchAccBookSuccess,
  fetchSumAccBookFailure,
  fetchSumAccBookSuccess,
} from "@/actions/AccBookActions";
import {
  fetchGenAccBook,
  fetchGenAccBookFailure,
  fetchGenSumAccBookFailure,
  fetchGenSumAccBookSuccess,
} from "@/actions/GenAccBookActions";

import {
  fetchAccountingBook,
  fetchSumAccountingBook,
} from "@/api/service/accountingBook";
import { fetchGenAccountingBook } from "@/api/service/genAccountingBook";
import {
  FETCH_ACCOUNT_BOOK,
  FETCH_SUM_ACCOUNT_BOOK,
} from "@/constants/AccountBookMamagement";
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
    yield put(fetchGenAccBook(response?.data));
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
    } = yield call(fetchSumAccountingBook, {
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
