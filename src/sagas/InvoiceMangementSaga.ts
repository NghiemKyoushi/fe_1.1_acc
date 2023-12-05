import axios from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchCreateInvoiceSuccess,
  fetchInvoice,
  fetchInvoiceFailure,
  fetchInvoiceSuccess,
  fetchPosSuccess,
  fetchSumInvoiceFailure,
  fetchSumInvoiceSuccess,
} from "@/actions/InvoiceManagementActions";
import { enqueueSnackbar, useSnackbar } from "notistack";
import {
  FETCH_CREATE_INVOICE,
  FETCH_INVOICE,
  FETCH_POS,
  FETCH_SUM_INVOICE,
} from "@/constants/InvoiceManagement";
import {
  fetchInvoiceInfo,
  fetchInvoiceSumTotal,
} from "@/api/service/invoiceManagement";
import { InvoiceSumTotal, ReceiptList } from "@/models/InvoiceManagement";
import { fetchPosSearch } from "@/api/service/posManagerApis";
import { fetchCreateInvoice } from "@/api/service/createInvoice";

function* fetchInvoiceSaga(action: any) {
  try {
    const response: { data: ReceiptList } = yield call(fetchInvoiceInfo, {
      ...action.payload,
    });
    yield put(fetchInvoiceSuccess(response?.data));
  } catch (e: any) {
    yield put(
      fetchInvoiceFailure({
        error: e.message,
      })
    );
  }
}
function* fetchSumInvoiceSaga(action: any) {
  try {
    const response: { data: InvoiceSumTotal } = yield call(
      fetchInvoiceSumTotal,
      {
        ...action.payload,
      }
    );
    yield put(fetchSumInvoiceSuccess(response?.data));
  } catch (e: any) {
    yield put(
      fetchSumInvoiceFailure({
        error: e.message,
      })
    );
  }
}

function* fetchGetPosName(action: any) {
  try {
    const result: Array<any> = yield call(fetchPosSearch, action.payload);
    yield put(fetchPosSuccess(result));
  } catch (error) {
    console.error(error);
  }
}

function* fetchCreateInvoiceSaga(action: any) {
  try {
    const response: { data: ReceiptList } = yield call(fetchCreateInvoice, {
      ...action.payload,
    });
    yield put(fetchCreateInvoiceSuccess(response?.data));
    enqueueSnackbar("Tạo hóa đơn thành công!!", { variant: "success" });
  } catch (e: any) {
    enqueueSnackbar("Tạo hóa đơn thất bại !!", { variant: "error" });
    yield put(
      fetchInvoiceFailure({
        error: e.message,
      })
    );
  }
}

function* invoiceSaga() {
  yield all([takeLatest(FETCH_INVOICE, fetchInvoiceSaga)]);
  yield all([takeLatest(FETCH_POS, fetchGetPosName)]);
  yield all([takeLatest(FETCH_CREATE_INVOICE, fetchCreateInvoiceSaga)]);
  yield all([takeLatest(FETCH_SUM_INVOICE, fetchSumInvoiceSaga)]);
}

export default invoiceSaga;
