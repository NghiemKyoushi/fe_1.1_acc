import { authApi } from "@/api/authApi";
import { CreateEntryParams } from "@/models/AccountingBookModel";

import { GenAccountingBookSearchParams } from "@/models/GenAccountingBookModel";
export const fetchGenAccountingBook = (
  param: GenAccountingBookSearchParams
) => {
  return authApi.get("/api/generalAccountEntries", {
    params: param,
  });
};

export const createNewGenAccountingBook = async (body: CreateEntryParams) => {
  return await authApi.post("/api/generalAccountEntries", body);
};
export const fetchGenSumAccountingBook = (
  param: GenAccountingBookSearchParams
) => {
  return authApi.get("/api/generalAccountEntries/sumUp", {
    params: param,
  });
};
export const fetchDetailGenAccountingBook = (id: string) => {
  return authApi.get(`/api/generalAccountEntries/${id}`);
};
export const updateDetailGenAccountingBook = (
  id: string,
  body: CreateEntryParams
) => {
  return authApi.put(`/api/branchAccountEntries/${id}`, body);
};
// export const createNewEntry = (body: CreateEntryParams) => {
//   return authApi.post("/api/branch-account-entry", body);
// };

// export const confirmNewEntry = (entryId: string) => {
//   return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
// };
