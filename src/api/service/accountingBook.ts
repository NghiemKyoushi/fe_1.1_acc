import { authApi } from "@/api/authApi";
import {
  AccountingBookSearchParams,
  CreateEntryParams,
} from "@/models/AccountingBookModel";
export const fetchAccountingBook = async (
  param: AccountingBookSearchParams
) => {
  return await authApi.get("/api/branchAccountEntries", {
    params: param,
  });
};
export const fetchSumAccountingBook = async (
  param: AccountingBookSearchParams
) => {
  return await authApi.get("/api/branchAccountEntries/sumUp", {
    params: param,
  });
};
export const createNewAccountingBook = async (body: CreateEntryParams) => {
  return await authApi.post("/api/branchAccountEntries", body);
};

export const fetchDetailAccountingBook = (id: string) => {
  return authApi.get(`/api/branchAccountEntries/${id}`);
};
export const updateDetailAccountingBook = (
  id: string,
  body: CreateEntryParams
) => {
  return authApi.put(`/api/branchAccountEntries/${id}`, body);
};
export const confirmNewEntry = (entryId: string) => {
  return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
};
