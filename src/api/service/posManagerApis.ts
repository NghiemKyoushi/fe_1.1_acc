import {
  PosParamBodySend,
  PosSearchParams,
} from "@/models/PortManagementModel";
import { authApi } from "../authApi";
import { fetchPosParams } from "./type";

export const fetchPosSearch = (props: fetchPosParams) => {
  const { posName, branchId } = props;
  const param = {
    searchKey: posName,
    branchId: branchId,
  };
  return authApi.get(`/api/poses/searchByCode`, {
    params: param,
  });
};

export const fetchPosManagementSearch = (param: PosSearchParams) => {
  return authApi.get(`/api/poses`, {
    params: param,
  });
};
export const fetchCreatePos = (params: PosParamBodySend) => {
  return authApi.post("/api/poses", params);
};
export const fetchUpdatePos = (id: string, params: PosParamBodySend) => {
  return authApi.put(`/api/poses/${id}`, params);
};
export const fetchPosDetail = (id: string) => {
  return authApi.get(`/api/poses/${id}`);
};
export const deletePosDetailApi = (id: string) => {
  return authApi.delete(`/api/poses/${id}`);
};
