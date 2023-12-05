import { authApi } from "@/api/authApi";

import { GenAccountingBookSearchParams } from "@/models/GenAccountingBookModel";
export const fetchGenAccountingBook = (
  param: GenAccountingBookSearchParams
) => {
  return authApi.get("/api/generalAccountEntries", {
    params: param,
  });
};
export const fetchGenSumAccountingBook = (
  param: GenAccountingBookSearchParams
) => {
  return authApi.get("/api/generalAccountEntries/sumUp", {
    params: param,
  });
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
