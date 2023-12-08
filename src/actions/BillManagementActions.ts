import {
  FETCH_BILL,
  FETCH_BILL_FAILURE,
  FETCH_BILL_SUCCESS,
  FETCH_FILTER_BILL,
  FETCH_FILTER_BILL_FAILURE,
  FETCH_FILTER_BILL_SUCCESS,
  FETCH_SUM_BILL,
  FETCH_SUM_BILL_FAILURE,
  FETCH_SUM_BILL_SUCCESS,
} from "@/constants/BillManagement";

export const fetchBills = (payload: any) => ({
  type: FETCH_BILL,
  payload,
});
export const fetchBillsSuccess = (payload: any) => ({
  type: FETCH_BILL_SUCCESS,
  payload,
});

export const fetchBillsFailure = (payload: any) => ({
  type: FETCH_BILL_FAILURE,
  payload,
});
export const fetchSumBills = (payload: any) => ({
  type: FETCH_SUM_BILL,
  payload,
});
export const fetchSumBillsSuccess = (payload: any) => ({
  type: FETCH_SUM_BILL_SUCCESS,
  payload,
});

export const fetchSumBillsFailure = (payload: any) => ({
  type: FETCH_SUM_BILL_FAILURE,
  payload,
});
// filter
export const fetchFilterBills = (payload: any) => ({
  type: FETCH_FILTER_BILL,
  payload,
});
export const fetchFilterBillsSuccess = (payload: any) => ({
  type: FETCH_FILTER_BILL_SUCCESS,
  payload,
});

export const fetchFilterBillsFailure = (payload: any) => ({
  type: FETCH_FILTER_BILL_FAILURE,
  payload,
});
