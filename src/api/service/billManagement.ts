import { authApi } from "@/api/authApi";
import {
  AccountingBookSearchParams,
  CreateEntryParams,
} from "@/models/AccountingBookModel";
import {
  MatchBills,
  PosFeeSearch,
  PosFeeUpdate,
} from "@/models/BillManagementModel";
export const fetchBill = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/bills", {
    params: param,
  });
};
export const fetchSumBill = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/bills/sumUp", {
    params: param,
  });
};

export const fetchFilterBill = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/bills/matchBills", {
    params: param,
  });
};
export const fetchConfirmFilterBill = (body: MatchBills) => {
  return authApi.put("/api/bills/matchBill", body);
};

export const fetchListModifyPosFee = (param: PosFeeSearch) => {
  return authApi.get("/api/bills/modifyPosFee", {
    params: param,
  });
};
export const fetchUpdatePosFee = (body: PosFeeUpdate) => {
  return authApi.put("/api/bills/modifyPosFee", body);
};
export const fetchUpdateRowPosFee = (
  idBill: string,
  body: { posId: string; posFeeStamp: number }
) => {
  return authApi.put(`/api/bills/${idBill}`, body);
};
// export const createNewEntry = (body: CreateEntryParams) => {
//   return authApi.post("/api/branch-account-entry", body);
// };

// export const confirmNewEntry = (entryId: string) => {
//   return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
// };
