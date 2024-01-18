import { PosSearchParams } from "@/models/PortManagementModel";
import { authApi } from "../authApi";
import { fetchPosParams } from "./type";
import { EditUserPrarams, EmpManageParamSearch, NewUserPrarams } from "@/models/EmpManagement";

export const fetchCreateEmp = (praramsBody: NewUserPrarams) => {
  return authApi.post("/api/auth/signup", praramsBody);
};
export const fetchUpdateEmp = (id: string, praramsBody: EditUserPrarams) => {
  return authApi.put(`/api/users/${id}`, praramsBody);
};

export const fetchEmp = (param: EmpManageParamSearch) => {
  return authApi.get("/api/users", {
    params: param,
  });
};
export const fetchDetailEmp = (id: string) => {
  return authApi.get(`/api/users/${id}`);
};

export const deleteDetailEmp = (id: string) => {
  return authApi.delete(`/api/users/${id}`);
};
