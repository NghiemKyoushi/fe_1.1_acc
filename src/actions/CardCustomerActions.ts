import {
  FETCH_ALL_CARD,
  FETCH_ALL_CARD_SUCCESS,
  FETCH_CARD_CUSTOMER,
  FETCH_CARD_CUSTOMER_SUCCESS,
  FETCH_CREATE_CARD_CUSTOMER,
  FETCH_CREATE_CARD_CUSTOMER_FAILURE,
  FETCH_CREATE_CARD_CUSTOMER_SUCCESS,
  FETCH_LIST_CARD_CUSTOMER,
  FETCH_LIST_CARD_CUSTOMER_FAILURE,
  FETCH_LIST_CARD_CUSTOMER_SUCCESS,
} from "@/constants/CardCustomerManagement";
import { cardType } from "@/models/CardCustomerModel";

export const fetchCardCustomer = (payload: any) => ({
  type: FETCH_CARD_CUSTOMER,
  payload,
});
export const fetchCardCustomerSuccess = (payload: any) => ({
  type: FETCH_CARD_CUSTOMER_SUCCESS,
  payload,
});
export const fetchAllCard = () => ({
  type: FETCH_ALL_CARD,
});
export const fetchAllCardSuccess = (payload: cardType[]) => ({
  type: FETCH_ALL_CARD_SUCCESS,
  payload,
});

export const fetchCreateCardCustomer = (payload: any) => ({
  type: FETCH_CREATE_CARD_CUSTOMER,
  payload,
});
export const fetchCreateCardCustomerSuccess = (payload: any) => ({
  type: FETCH_CREATE_CARD_CUSTOMER_SUCCESS,
  payload,
});
export const fetchCreateCardCustomerFailure = (payload: any) => ({
  type: FETCH_CREATE_CARD_CUSTOMER_FAILURE,
  payload,
});

export const fetchListCardCustomer = (payload: any) => ({
  type: FETCH_LIST_CARD_CUSTOMER,
  payload,
});
export const fetchListCardCustomerSuccess = (payload: any) => ({
  type: FETCH_LIST_CARD_CUSTOMER_SUCCESS,
  payload,
});
export const fetchListCardCustomerFailure = (payload: any) => ({
  type: FETCH_LIST_CARD_CUSTOMER_FAILURE,
  payload,
});
