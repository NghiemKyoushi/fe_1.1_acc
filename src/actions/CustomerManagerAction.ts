import {
  FETCH_ALL_CUSTOMER_SUCCESS,
  FETCH_All_CUSTOMER,
  FETCH_All_CUSTOMER_FAILURE,
  FETCH_SEARCH_CUSTOMER,
  FETCH_SEARCH_CUSTOMER_SUCCESS,
} from "@/constants/CustomerManagement";
import {
  ColCustomer,
  CustomerParams,
  CustomerSearchByName,
  CustomerSearchByNameParams,
} from "@/models/CustomerManager";

export const fetchSearchCustomer = (payload: CustomerSearchByNameParams) => ({
  type: FETCH_SEARCH_CUSTOMER,
  payload,
});
export const fetchSearchCustomerSuccess = (
  payload: CustomerSearchByName[]
) => ({
  type: FETCH_SEARCH_CUSTOMER_SUCCESS,
  payload,
});

export const fetchListCustomer = (payload: CustomerParams) => ({
  type: FETCH_All_CUSTOMER,
  payload,
});
export const fetchListCustomerSuccess = (payload: ColCustomer[]) => ({
  type: FETCH_ALL_CUSTOMER_SUCCESS,
  payload,
});
export const fetchListCustomerFailure = (payload: any) => ({
  type: FETCH_All_CUSTOMER_FAILURE,
  payload,
});
