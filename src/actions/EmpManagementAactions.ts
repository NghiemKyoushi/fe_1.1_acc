import {
  FETCH_CREATE_EMP,
  FETCH_CREATE_EMP_FAILURE,
  FETCH_CREATE_EMP_SUCCESS,
  FETCH_EMP,
  FETCH_EMP_FAILURE,
  FETCH_EMP_SUCCESS,
} from "@/constants/EmpManagement";

export const fetchEmp = (payload: any) => ({
  type: FETCH_EMP,
  payload,
});
export const fetchEmpSuccess = (payload: any) => ({
  type: FETCH_EMP_SUCCESS,
  payload,
});

export const fetchEmpFailure = (payload: any) => ({
  type: FETCH_EMP_FAILURE,
  payload,
});

export const fetchCreateEmp = (payload: any) => ({
  type: FETCH_CREATE_EMP,
  payload,
});
export const fetchCreateEmpSuccess = (payload: any) => ({
  type: FETCH_CREATE_EMP_SUCCESS,
  payload,
});

export const fetchCreateEmpFailure = (payload: Object) => ({
  type: FETCH_CREATE_EMP_FAILURE,
  payload,
});
