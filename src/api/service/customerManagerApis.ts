import { CustomerSearchByNameParams } from "@/models/CustomerManager";
import { authApi } from "../authApi";
import { CustomerSearchProps } from "./type";

export const fetchCustomer = (props: CustomerSearchByNameParams) => {
  const { customerName } = props;
  return authApi.get(`/api/customers/findByName/${customerName}`);
};
