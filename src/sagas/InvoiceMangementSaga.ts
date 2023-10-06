import axios from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchInvoice,
  fetchInvoiceFailure,
  fetchInvoiceSuccess,
} from "@/actions/InvoiceManagementActions";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { FETCH_INVOICE } from "@/constants/InvoiceManagement";
import { fetchInvoiceInfo } from "@/api/service/invoiceManagement";

function* fetchInvoiceSaga(action: any) {
  try {
    const response: object = yield call(fetchInvoiceInfo, {
      employeeId: action.payload.employeeId,
      customerCardId: action.payload.customerCardId,
      posId: action.payload.posId,
      startDate: action.payload.startDate,
      endDate: action.payload.endDate,
      page: action.payload.page,
      pageSize: action.payload.pageSize,
      sorter: action.payload.sorter,
      sortDirection: action.payload.sortDirection,
    });
    console.log("response", response);
    // yield put(fetchInvoiceSuccess(response));
    // action.payload.callback(response.jwtToken);
    enqueueSnackbar("Đăng nhập thành công!!", { variant: "success" });
  } catch (e: any) {
    yield put(
      fetchInvoiceFailure({
        error: e.message,
      })
    );
    enqueueSnackbar("Đăng nhập thất bại !!", { variant: "error" });
  }
}

function* invoiceSaga() {
  yield all([takeLatest(FETCH_INVOICE, fetchInvoiceSaga)]);
}

export default invoiceSaga;
