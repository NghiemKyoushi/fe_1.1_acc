import { authApi } from "@/api/authApi";
import {
  AccountingBookSearchParams,
  CreateEntryParams,
} from "@/models/AccountingBookModel";
import { MatchBills } from "@/models/BillManagementModel";
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
// export const fetchDetailAccountingBook = (id: string) => {
//   return authApi.get(`/api/branchAccountEntries/sumUp/${id}`);
// };
// export const createNewEntry = (body: CreateEntryParams) => {
//   return authApi.post("/api/branch-account-entry", body);
// };

// export const confirmNewEntry = (entryId: string) => {
//   return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
// };
