import { BranchParamSend } from "@/models/BranchManagementModel";
import { authApi } from "../authApi";

export const getAllBranch = async () => {
  return authApi.get(`/api/branches`);
};
export const getDetailBranch = async (id: string) => {
  return authApi.get(`/api/branches/${id}`);
};

export const createNewBranch = async (body: BranchParamSend) => {
  return authApi.post(`/api/branches`, body);
};

export const updateNewBranch = async (id: string, body: BranchParamSend) => {
    return authApi.post(`/api/branches/${id}`, body);
  };