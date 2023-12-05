import {
  FETCH_ACCOUNT_BOOK,
  FETCH_ACCOUNT_BOOK_FAILURE,
  FETCH_ACCOUNT_BOOK_SUCCESS,
  FETCH_SUM_ACCOUNT_BOOK,
  FETCH_SUM_ACCOUNT_BOOK_FAILURE,
  FETCH_SUM_ACCOUNT_BOOK_SUCCESS,
} from "@/constants/AccountBookMamagement";

export const fetchAccBook = (payload: any) => ({
  type: FETCH_ACCOUNT_BOOK,
  payload,
});
export const fetchAccBookSuccess = (payload: any) => ({
  type: FETCH_ACCOUNT_BOOK_SUCCESS,
  payload,
});

export const fetchAccBookFailure = (payload: any) => ({
  type: FETCH_ACCOUNT_BOOK_FAILURE,
  payload,
});
export const fetchSumAccBook = (payload: any) => ({
  type: FETCH_SUM_ACCOUNT_BOOK,
  payload,
});
export const fetchSumAccBookSuccess = (payload: any) => ({
  type: FETCH_SUM_ACCOUNT_BOOK_SUCCESS,
  payload,
});

export const fetchSumAccBookFailure = (payload: any) => ({
  type: FETCH_SUM_ACCOUNT_BOOK_FAILURE,
  payload,
});
