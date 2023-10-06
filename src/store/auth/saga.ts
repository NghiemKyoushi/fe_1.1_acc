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
import { loginUserFn } from "@/api/service/atuth";
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
    const response: { jwtToken: string } = yield call(loginUserFn, {
      usernameOrEmail: action.payload.values.email,
      password: action.payload.values.password,
    });
    // console.log("response", response.jwtToken);
    yield put(
      loginSuccess({
        token: response.jwtToken,
      })
    );
    action.payload.callback(response.jwtToken);
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
