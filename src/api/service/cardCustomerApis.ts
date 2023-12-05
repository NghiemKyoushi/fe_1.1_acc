import { CardCustomerParams, NewCardType } from "@/models/CardCustomerModel";
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
