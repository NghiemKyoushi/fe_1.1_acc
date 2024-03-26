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
  return authApi.put(`/api/generalAccountEntries/${id}`, body);
};
// export const createNewEntry = (body: CreateEntryParams) => {
//   return authApi.post("/api/branch-account-entry", body);
// };
export const deleteGenAccountingBook = (id: string) => {
  return authApi.delete(`/api/generalAccountEntries/${id}`);
};
export const confirmGenNewEntry = (entryId: string) => {
  return authApi.put(`/api/generalAccountEntries/approve/${entryId}`);
};

export const conrimEditNoteGenAccountingBook = (reason: { id: string; note: string }) => {
  return authApi.put("/api/generalAccountEntries/note", reason);
};