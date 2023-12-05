import { authApi } from "@/api/authApi";
import {
  AccountingBookSearchParams,
  CreateEntryParams,
} from "@/models/AccountingBookModel";
export const fetchAccountingBook = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/branchAccountEntries", {
    params: param,
  });
};
export const fetchSumAccountingBook = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/branchAccountEntries/sumUp", {
    params: param,
  });
};
export const fetchDetailAccountingBook = (id: string) => {
  return authApi.get(`/api/branchAccountEntries/sumUp/${id}`);
};
export const createNewEntry = (body: CreateEntryParams) => {
  return authApi.post("/api/branch-account-entry", body);
};

export const confirmNewEntry = (entryId: string) => {
  return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
};
