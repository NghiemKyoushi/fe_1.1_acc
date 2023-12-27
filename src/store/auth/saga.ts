import axios from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  loginFailure,
  loginSuccess,
  signupSuccess,
  signupFailure,
} from "./actions";
import { LOGIN_REQUEST, SIGNUP_REQUEST } from "./actionTypes";
import { IAuth } from "./types";
import { loginUserFn } from "@/api/service/auth";
import { enqueueSnackbar, useSnackbar } from "notistack";

const signup = async (payload: { email: string; password: string }) => {
  const { data } = await axios.post<IAuth>(
    "https://reqres.in/api/register",
    { ...payload },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return data;
};

function* loginSaga(action: any) {
  try {
    const response: {
      token: string;
      name: string;
      branches: Array<any>;
      id: string;
      roles: Array<any>;
    } = yield call(loginUserFn, {
      code: action.payload.values.email,
      password: action.payload.values.password,
    });
    yield put(
      loginSuccess({
        token: response.token,
        userName: response.name,
        branchId: response.branches[0].id,
        branchName: response.branches[0].name,
        employeeId: response.id,
        roles: response.roles[0].title,
      })
    );
    action.payload.callback(response.token);
    enqueueSnackbar("Đăng nhập thành công!!", { variant: "success" });
  } catch (e: any) {
    yield put(
      loginFailure({
        error: e.message,
      })
    );
    enqueueSnackbar("Đăng nhập thất bại !!", { variant: "error" });
  }
}

function* signupSaga(action: any) {
  try {
    const response: { token: string } = yield call(signup, {
      email: action.payload.values.email,
      password: action.payload.values.password,
    });

    yield put(
      signupSuccess({
        token: response.token,
      })
    );
    action.payload.callback(response.token);
  } catch (e: any) {
    yield put(
      signupFailure({
        error: e.message,
      })
    );
  }
}

function* authSaga() {
  yield all([takeLatest(LOGIN_REQUEST, loginSaga)]);
  yield all([takeLatest(SIGNUP_REQUEST, signupSaga)]);
}

export default authSaga;
