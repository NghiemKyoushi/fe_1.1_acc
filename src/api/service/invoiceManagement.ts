import { authApi } from "@/api/authApi";
import {
  InvoiceConfirmParams,
  ReceiptCreationParams,
  RepayConfirmParams,
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
export const updateInvoice = (id: string, body: ReceiptCreationParams) => {
  return authApi.put(`/api/receipts/${id}`, body);
};
export const fetchSaveImage = async (oldId: string, file: any) => {
  const formDatas = new FormData();
  formDatas.append("file", file);
  if (oldId === "") {
    return await authApi.post(`/api/files`, formDatas, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return await authApi.post(`/api/files?imageId=${oldId}`, formDatas, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const fetchImagePath = async (id: string) => {
  const imageBlob = await authApi.get(`/api/files/${id}`, {
    responseType: "blob",
  });
  return imageBlob;
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

export const conrimRepayInvoice = (reason: RepayConfirmParams) => {
  return authApi.put("/api/receipts/repayReceipt", reason);
};

export const deleteInvoice = (id: string) => {
  return authApi.delete(`/api/receipts/${id}`);
};
