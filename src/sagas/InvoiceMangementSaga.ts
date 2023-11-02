import axios from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchInvoice,
  fetchInvoiceFailure,
  fetchInvoiceSuccess,
  fetchPosSuccess,
} from "@/actions/InvoiceManagementActions";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { FETCH_INVOICE, FETCH_POS } from "@/constants/InvoiceManagement";
import { fetchInvoiceInfo } from "@/api/service/invoiceManagement";
import { fetchPosSearch } from "@/api/service/createInvoice";

function* fetchInvoiceSaga(action: any) {
  try {
    const response: object = yield call(fetchInvoiceInfo, {
      employeeId: action.payload.employeeId,
      customerCardId: action.payload.customerCardId,
      posId: action.payload.posId,
      // startDate: action.payload.startDate,
      // endDate: action.payload.endDate,
      page: action.payload.page,
      pageSize: action.payload.pageSize,
      sorter: action.payload.sorter,
      sortDirection: action.payload.sortDirection,
    });
    console.log("response", response);
    yield put(fetchInvoiceSuccess(response?.data));
  } catch (e: any) {
    yield put(
      fetchInvoiceFailure({
        error: e.message,
      })
    );
  }
}

function* fetchGetPosName(action: any) {
  try {
    console.log("action", action);
    const result: Array<any> = yield call(fetchPosSearch, action.payload);
    console.log("result", result);
    yield put(fetchPosSuccess(result));
  } catch (error) {
    console.error(error);
  }
}

function* invoiceSaga() {
  yield all([takeLatest(FETCH_INVOICE, fetchInvoiceSaga)]);
  yield all([takeLatest(FETCH_POS, fetchGetPosName)]);
}

export default invoiceSaga;
