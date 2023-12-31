import { authApi } from "@/api/authApi";
import {
  InvoiceProps,
  CardByCusIdProps,
  PosSearchProps,
  CustomerSearchProps,
  fetchInvoiceInfoPrams,
  fetchPosParams,
} from "./type";

export const fetchCreateInvoice = (props: InvoiceProps) => {
  const {
    percentageFee,
    branchId,
    shipmentFee,
    receiptBills,
    imageId,
    customerCardId,
  } = props;
  const dataSend = {
    percentageFee,
    shipmentFee,
    receiptBills,
    imageId,
    branchId,
    customerCardId,
  };
  return authApi.post("/api/receipts", dataSend);
};

export const fetcCardByCustomerId = (props: CardByCusIdProps) => {
  return authApi.get(`/api/customer-cards?customerId=${props}`);
};

//sendImage
// export const fetchSaveImage = (props: any) => {
//   const formData = new FormData();
//   formData.append("file", props);
//   return authApi.post("/api/files", formData);
// };
export const fetchGetImage = (props: any) => {
  const formData = new FormData();
  formData.append("file", props);
  return authApi.post("/api/img", formData);
};
export const deleteImage = (fileId: string) => {
  return authApi.delete(`/api/img/${fileId}`);
};
