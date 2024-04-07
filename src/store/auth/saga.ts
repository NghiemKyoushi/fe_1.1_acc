import axios from "axios";
import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import Cookies from "js-cookie";

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
      branchManagementScopes: Array<any>;
      id: string;
      roles: Array<any>;
      code: string;
      branchesCodeList: Array<any>;
    } = yield call(loginUserFn, {
      code: action.payload.values.email,
      password: action.payload.values.password,
    });
    const sortBranch = response?.branchManagementScopes.sort(
      (a: { orderId: number }, b: { orderId: number }) => a.orderId - b.orderId
    );
    Cookies.set("token", response.token, { expires: 1 / 24 });
    Cookies.set("userName", response.name);
    Cookies.set("code", response.code);
    Cookies.set("branchId", sortBranch[0].id);
    Cookies.set("employeeId", response.id);
    Cookies.set("roles", response.roles[0].title);
    Cookies.set("branchName", sortBranch[0].branch.name);
    Cookies.set("branchCode", sortBranch[0].branch.code);

    Cookies.set("branchesCodeList", JSON.stringify(sortBranch));

    yield put(
      loginSuccess({
        token: response.token,
        userName: response.name,
        branchId: sortBranch[0].id,
        branchName: sortBranch[0].name,
        branch: response.branchManagementScopes,
        employeeId: response.id,
        roles: response.roles[0].title,
      })
    );
    action.payload.callback(response.token);
    enqueueSnackbar("Đăng nhập thành công!!", { variant: "success" });
    // Start a timer that counts down from 5 minutes

    let remainingTime = 55 * 60 * 1000;
    const timer = setInterval(() => {
      remainingTime -= 1000;
      if (remainingTime <= 0) {
        clearInterval(timer);
        alert("Thời gian đăng nhập sắp hết!!");
        // enqueueSnackbar("Thời gian đăng nhập sắp hết!!", { variant: "warning" });
      }
    }, 1000);

    // yield delay(5 * 60 * 1000 - 300000); // Wait for 5 minutes minus 5 seconds
    // enqueueSnackbar("Thời gian đăng nhập sắp hết!!", { variant: "warning" });
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
