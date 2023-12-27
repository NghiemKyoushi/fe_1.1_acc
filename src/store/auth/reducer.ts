import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
} from "./actionTypes";

import { AuthActions, AuthState } from "./types";

const initialState: AuthState = {
  isLoading: false,
  token: "",
  userName: "",
  branchId: "",
  branchName: "",
  employeeId: "",
  roles: "",
  error: null,
};

const reducers = (state = initialState, action: AuthActions) => {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: "",
        error: action.payload.error,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        error: null,
      };

    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        userName: action.payload.userName,
        branchId: action.payload.branchId,
        branchName: action.payload.branchName,
        employeeId: action.payload.employeeId,
        roles: action.payload.roles,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: "",
        error: action.payload.error,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: "",
        error: action.payload.error,
      };
    case LOGOUT:
      return {
        ...state,
        isLoading: false,
        token: "",
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducers;
