import {
  fetchCreateEmpSuccess,
  fetchEmpFailure,
  fetchEmpSuccess,
} from "@/actions/EmpManagementAactions";
import { fetchCreateEmp, fetchEmp } from "@/api/service/empManagementApis";
import { FETCH_CREATE_EMP, FETCH_EMP } from "@/constants/EmpManagement";
import { enqueueSnackbar } from "notistack";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchEmpManagementSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchEmp, {
      ...action.payload,
    });
    yield put(fetchEmpSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchEmpFailure(e));
  }
}
function* fetchCreateEmpSaga(action: any) {
  try {
    const response: { data: any } = yield call(fetchCreateEmp, {
      ...action.payload,
    });
    yield put(fetchCreateEmpSuccess(response?.data));
    enqueueSnackbar("Tạo người dùng thành công!!", { variant: "success" });

  } catch (e: any) {
    yield put(fetchEmpFailure(e));
    enqueueSnackbar("Tạo người dùng thất bại !!", { variant: "error" });

  }
}
function* empManagermentSaga() {
  yield all([takeLatest(FETCH_EMP, fetchEmpManagementSaga)]);
  yield all([takeLatest(FETCH_CREATE_EMP, fetchCreateEmpSaga)]);
}

export default empManagermentSaga;
