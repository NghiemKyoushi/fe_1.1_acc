import { fetchInvoiceInfoPrams } from "@/api/service/type";
import {
  FETCH_INVOICE,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_SUCCESS,
} from "@/constants/InvoiceManagement";
import { InvoiceDetail } from "@/models/InvoiceManagement";

export const fetchInvoice = (payload: fetchInvoiceInfoPrams) => ({
  type: FETCH_INVOICE,
  payload
});

export const fetchInvoiceSuccess = (payload: Array<InvoiceDetail>) => ({
  type: FETCH_INVOICE_FAILURE,
  payload,
});

export const fetchInvoiceFailure = (payload: Object) => ({
  type: FETCH_INVOICE_SUCCESS,
  payload,
});
