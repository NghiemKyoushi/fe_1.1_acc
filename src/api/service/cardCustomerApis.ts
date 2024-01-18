import {
  CardCustomerParams,
  CustomerCardSearch,
  NewCardType,
} from "@/models/CardCustomerModel";
import { authApi } from "../authApi";
import { fetchPosParams } from "./type";

export const fetchCardCustomerSearch = (props: CardCustomerParams) => {
  const { customerId } = props;
  return authApi.get(`/api/customerCards/findByCustomerId/${customerId}`);
};
export const fetchGetAllCard = async () => {
  return authApi.get(`/api/cardTypes`);
};
export const fetchCreateCardCustomer = (props: NewCardType) => {
  return authApi.post(`/api/customerCards`, props);
};
export const updateCardCustomer = (id: string, props: NewCardType) => {
  return authApi.put(`/api/customerCards/${id}`, props);
};
export const getDetailCardCustomer = (id: string) => {
  return authApi.get(`/api/customerCards/${id}`);
};
export const deleteCardCustomerApi = (id: string) => {
  return authApi.delete(`/api/customerCards/${id}`);
};
export const fetchCardCustomer = (param: CustomerCardSearch) => {
  return authApi.get(`/api/customerCards`, {
    params: param,
  });
};
// cardType
export const createCardType = async (name: string) => {
  return authApi.post(`/api/cardTypes`, { name: name });
};

export const updateCardType = async (name: string, id: string) => {
  return authApi.put(`/api/cardTypes/${id}`, { name: name });
};

export const deleteCardType = async (id: string) => {
  return authApi.delete(`/api/cardTypes/${id}`);
};
