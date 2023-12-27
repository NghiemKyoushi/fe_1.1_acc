import {
  fetchAccEntryTypeFailure,
  fetchAccEntryTypeSuccess,
} from "@/actions/AccEntryTypeActions";
import { fetchAccEntryList } from "@/api/service/accEntryType";
import { fetchBill, fetchSumBill } from "@/api/service/billManagement";
import { FETCH_ACC_ENTRY_TYPE } from "@/constants/AccEntryType";

import { FETCH_BILL, FETCH_SUM_BILL } from "@/constants/BillManagement";
import { enqueueSnackbar } from "notistack";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchAccountEntryListSaga(action: any) {
  try {
    const response: { data: Array<any> } = yield call(fetchAccEntryList, {
      ...action.payload,
    });
    let valueArr: any[] = [];
    if (response) {
      response.data.map((item: any) => {
        valueArr.push({
          id: item.id,
          key: item.title,
          values: item.title,
        });
      });
    }
    yield put(fetchAccEntryTypeSuccess(valueArr));
  } catch (e: any) {
    yield put(fetchAccEntryTypeFailure(e));
  }
}

function* fetchAccEntryTypeSaga() {
  yield all([takeLatest(FETCH_ACC_ENTRY_TYPE, fetchAccountEntryListSaga)]);
}

export default fetchAccEntryTypeSaga;
