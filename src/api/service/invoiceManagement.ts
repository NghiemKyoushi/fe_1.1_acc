import { authApi } from "@/api/authApi";
import {
  InvoiceConfirmParams,
  ReceiptCreationParams,
} from "@/models/InvoiceManagement";
import { fetchInvoiceInfoPrams } from "./type";

export const fetchInvoiceInfo = (param: fetchInvoiceInfoPrams) => {
  return authApi.get("/api/receipts", {
    params: param,
  });
};
export const fetchInvoiceDetail = (id: string) => {
  return authApi.get(`/api/receipts/${id}`);
};
export const fetchInvoiceSumTotal = (param: fetchInvoiceInfoPrams) => {
  return authApi.get("/api/receipts/sumUp", {
    params: param,
  });
};
export const fetchCreateInvoice = (params: ReceiptCreationParams) => {
  return authApi.post("/api/receipts", params);
};
export const fetchBranch = () => {
  return authApi.get("/api/branches");
};
export const fetchRoles = () => {
  return authApi.get("/api/roles");
};
export const conrimInvoice = (reason: InvoiceConfirmParams) => {
  return authApi.put("/api/receipts/confirmReceipt", reason);
};
