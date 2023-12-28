import {
  FETCH_BRANCH,
  FETCH_BRANCH_FAILURE,
  FETCH_BRANCH_SUCCESS,
} from "@/constants/BranchManagement";

export const fetchBranch = () => ({
  type: FETCH_BRANCH,
});
export const fetchBranchSuccess = (payload: any) => ({
  type: FETCH_BRANCH_SUCCESS,
  payload,
});
export const fetchBranchFailure = (payload: any) => ({
  type: FETCH_BRANCH_FAILURE,
  payload,
});
