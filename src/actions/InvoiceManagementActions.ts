import { fetchInvoiceInfoPrams, fetchPosParams } from "@/api/service/type";
import {
  FETCH_CREATE_INVOICE,
  FETCH_CREATE_INVOICE_FAILURE,
  FETCH_CREATE_INVOICE_SUCCESS,
  FETCH_INVOICE,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_SUCCESS,
  FETCH_POS,
  FETCH_POS_SUCCESS,
  FETCH_SUM_INVOICE,
  FETCH_SUM_INVOICE_FAILURE,
  FETCH_SUM_INVOICE_SUCCESS,
} from "@/constants/InvoiceManagement";
import { InvoiceDetail, InvoiceSumTotal, ReceiptList } from "@/models/InvoiceManagement";

export const fetchInvoice = (payload: fetchInvoiceInfoPrams) => ({
  type: FETCH_INVOICE,
  payload,
});

// Array<InvoiceDetail>
export const fetchInvoiceSuccess = (payload: ReceiptList) => ({
  type: FETCH_INVOICE_SUCCESS,
  payload,
});

export const fetchInvoiceFailure = (payload: Object) => ({
  type: FETCH_INVOICE_FAILURE,
  payload,
});
export const fetchSumInvoice = (payload: fetchInvoiceInfoPrams) => ({
  type: FETCH_SUM_INVOICE,
  payload,
});

// Array<InvoiceDetail>
export const fetchSumInvoiceSuccess = (payload: InvoiceSumTotal) => ({
  type: FETCH_SUM_INVOICE_SUCCESS,
  payload,
});

export const fetchSumInvoiceFailure = (payload: Object) => ({
  type: FETCH_SUM_INVOICE_FAILURE,
  payload,
});

export const fetchCreateInvoice = (payload: any) => ({
  type: FETCH_CREATE_INVOICE,
  payload,
});

export const fetchCreateInvoiceSuccess = (payload: any) => ({
  type: FETCH_CREATE_INVOICE_SUCCESS,
  payload,
});

export const fetchCreateInvoiceFailure = (payload: Object) => ({
  type: FETCH_CREATE_INVOICE_FAILURE,
  payload,
});

export const fetchPos = (payload: fetchPosParams) => ({
  type: FETCH_POS,
  payload,
});
export const fetchPosSuccess = (payload: any) => ({
  type: FETCH_POS_SUCCESS,
  payload,
});
