import { PosSearchParams } from "@/models/PortManagementModel";
import { authApi } from "../authApi";
import { fetchPosParams } from "./type";
import { EmpManageParamSearch, NewUserPrarams } from "@/models/EmpManagement";

export const fetchCreateEmp = (praramsBody: NewUserPrarams) => {
  return authApi.post("/api/auth/signup", praramsBody);
};

export const fetchEmp = (param: EmpManageParamSearch) => {
  return authApi.get("/api/users", {
    params: param,
  });
};
export const fetchDetailEmp = (id: string) => {
  return authApi.get(`/api/users/${id}`);
};
