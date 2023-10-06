import { authApi } from "@/api/authApi";
import {
  AccountingBookSearchParams,
  CreateEntryParams,
} from "@/models/AccountingBookModel";
export const fetchAccountingBook = (param: AccountingBookSearchParams) => {
  return authApi.get("/api/branch-account-entry/account-book", {
    params: param,
  });
};

export const createNewEntry = (body: CreateEntryParams) => {
  return authApi.post("/api/branch-account-entry", body);
};

export const confirmNewEntry = (entryId: string) => {
  return authApi.put(`/api/branch-account-entry/confirm-entry/${entryId}`);
};
