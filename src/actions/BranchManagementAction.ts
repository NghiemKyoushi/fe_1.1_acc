import {
  FETCH_BRANCH,
  FETCH_BRANCH_FAILURE,
  FETCH_BRANCH_SUCCESS,
} from "@/constants/BranchManagement";

export const fetchBranch = (payload: any) => ({
  type: FETCH_BRANCH,
  payload,
});
export const fetchBranchSuccess = (payload: any) => ({
  type: FETCH_BRANCH_SUCCESS,
  payload,
});
export const fetchBranchFailure = (payload: any) => ({
  type: FETCH_BRANCH_FAILURE,
  payload,
});
