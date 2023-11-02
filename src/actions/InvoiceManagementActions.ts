import { fetchInvoiceInfoPrams, fetchPosParams } from "@/api/service/type";
import {
  FETCH_INVOICE,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_SUCCESS,
  FETCH_POS,
  FETCH_POS_SUCCESS
} from "@/constants/InvoiceManagement";
import { InvoiceDetail } from "@/models/InvoiceManagement";

export const fetchInvoice = (payload: fetchInvoiceInfoPrams) => ({
  type: FETCH_INVOICE,
  payload
});

// Array<InvoiceDetail>
export const fetchInvoiceSuccess = (payload: any ) => ({
  type: FETCH_INVOICE_SUCCESS,
  payload,FETCH_INVOICE_SUCCESS
});

export const fetchInvoiceFailure = (payload: Object) => ({
  type: FETCH_INVOICE_FAILURE,
  payload,
});

export const fetchPos = (payload: fetchPosParams) => ({
  type: FETCH_POS,
  payload
});
export const fetchPosSuccess = (payload: any) => ({
  type: FETCH_POS_SUCCESS,
  payload
});


