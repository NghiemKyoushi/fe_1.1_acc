import {
  CustomerParams,
  CustomerSearchByNameParams,
  NewCustomer,
} from "@/models/CustomerManager";
import { authApi } from "../authApi";
import { CustomerSearchProps } from "./type";

export const fetchCustomer = (props: CustomerSearchByNameParams) => {
  const { customerName } = props;
  return authApi.get(`/api/customers/findByName/${customerName}`);
};
export const fetchCustomerById = (id: string) => {
  return authApi.get(`/api/customers/${id}`);
};
export const fetchAllCustomer = (param: CustomerParams) => {
  return authApi.get(`/api/customers`, {
    params: param,
  });
};
export const createNewCustomer = (param: NewCustomer) => {
  return authApi.post(`/api/customers`, param);
};
export const updateCustomer = (id: string, param: NewCustomer) => {
  return authApi.put(`/api/customers/${id}`, param);
};
export const deleteCustomer = (id: string) => {
  return authApi.delete(`/api/customers/${id}`);
};
