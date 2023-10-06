import { authApi } from "@/api/authApi";
import { InvoiceConfirmParams } from "@/models/InvoiceManagement";
import { fetchInvoiceInfoPrams } from "./type";


export const conrimInvoiceApi = (reason: InvoiceConfirmParams) => {
  return authApi.post("/api/branch-account-entry/confirm-receipt-entry", reason);
};
export const fetchInvoiceInfo = (param: fetchInvoiceInfoPrams) => {
  return authApi.get("/api/receipts", {
    params: param,
  });
};
