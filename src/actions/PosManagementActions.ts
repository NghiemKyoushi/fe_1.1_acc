import {
  FETCH_POS_MANAGEMENT,
  FETCH_POS_MANAGEMENT_SUCCESS,
} from "@/constants/PosManagement";

export const fetchPosManagement = (payload: any) => ({
  type: FETCH_POS_MANAGEMENT,
  payload,
});
export const fetchPosManagementSuccess = (payload: any) => ({
  type: FETCH_POS_MANAGEMENT_SUCCESS,
  payload,
});
