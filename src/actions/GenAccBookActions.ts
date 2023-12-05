import {
  FETCH_GEN_ACCOUNT_BOOK,
  FETCH_GEN_ACCOUNT_BOOK_FAILURE,
  FETCH_GEN_ACCOUNT_BOOK_SUCCESS,
  FETCH_GEN_SUM_ACCOUNT_BOOK,
  FETCH_GEN_SUM_ACCOUNT_BOOK_FAILURE,
  FETCH_GEN_SUM_ACCOUNT_BOOK_SUCCESS,
} from "@/constants/GenAccountBookMamagement";
import { GenAccountingBookSearchParams } from "@/models/GenAccountingBookModel";

export const fetchGenAccBook = (payload: GenAccountingBookSearchParams) => ({
  type: FETCH_GEN_ACCOUNT_BOOK,
  payload,
});
export const fetchGenAccBookSuccess = (payload: any) => ({
  type: FETCH_GEN_ACCOUNT_BOOK_SUCCESS,
  payload,
});

export const fetchGenAccBookFailure = (payload: any) => ({
  type: FETCH_GEN_ACCOUNT_BOOK_FAILURE,
  payload,
});
export const fetchGenSumAccBook = (payload: any) => ({
  type: FETCH_GEN_SUM_ACCOUNT_BOOK,
  payload,
});
export const fetchGenSumAccBookSuccess = (payload: any) => ({
  type: FETCH_GEN_SUM_ACCOUNT_BOOK_SUCCESS,
  payload,
});

export const fetchGenSumAccBookFailure = (payload: any) => ({
  type: FETCH_GEN_SUM_ACCOUNT_BOOK_FAILURE,
  payload,
});
