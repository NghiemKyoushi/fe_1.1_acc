import {
  FETCH_SEARCH_CUSTOMER,
  FETCH_SEARCH_CUSTOMER_SUCCESS,
} from "@/constants/CustomerManagement";
import {
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
