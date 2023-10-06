import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
  } from "./actionTypes";
  
  import { AuthActions, AuthState } from "./types";
  
  const initialState: AuthState = {
    isLoading: false,
    token: "",
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
        console.log("jjfjfjf", action)
        return {
          ...state,
          isLoading: false,
          token: action.payload.token,
          error: null,
        };
      case LOGIN_FAILURE:
        return {
          ...state,
          isLoading: false,
          token: "",
          error: action.payload.error,
        };
      default:
        return {
          ...state,
        };
    }
  };
  
  export default reducers;