import { FETCH_ACC_ENTRY_TYPE, FETCH_ACC_ENTRY_TYPE_FAILURE, FETCH_ACC_ENTRY_TYPE_SUCCESS } from "@/constants/AccEntryType";

export const fetchAccEntryType = () => ({
    type: FETCH_ACC_ENTRY_TYPE,
  });
  export const fetchAccEntryTypeSuccess = (payload: any) => ({
    type: FETCH_ACC_ENTRY_TYPE_SUCCESS,
    payload,
  });
  
  export const fetchAccEntryTypeFailure = (payload: any) => ({
    type: FETCH_ACC_ENTRY_TYPE_FAILURE,
    payload,
  });