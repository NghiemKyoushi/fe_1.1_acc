import { fetchCardCustomerSuccess } from "@/actions/CardCustomerActions";
import { fetchListCustomerFailure, fetchListCustomerSuccess, fetchSearchCustomerSuccess } from "@/actions/CustomerManagerAction";
import { fetchAllCustomer, fetchCustomer } from "@/api/service/customerManagerApis";
import { FETCH_All_CUSTOMER, FETCH_SEARCH_CUSTOMER } from "@/constants/CustomerManagement";
import { ColCustomer, CustomerSearchByName } from "@/models/CustomerManager";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchSearchCustomerSaga(action: any) {
  try {
      const response: { data: CustomerSearchByName[] } = yield call(
        fetchCustomer,
        {
          ...action.payload,
        }
      );
      yield put(fetchSearchCustomerSuccess(response?.data));
  } catch (e: any) {}
}

function* fetchAllCustomerSaga(action: any) {
  try {
      const response: { data: ColCustomer[] } = yield call(
        fetchAllCustomer,
        {
          ...action.payload,
        }
      );
      yield put(fetchListCustomerSuccess(response?.data));
  } catch (e: any) {
    yield put(fetchListCustomerFailure(e));

  }
}

function* customerSaga() {
  yield all([takeLatest(FETCH_SEARCH_CUSTOMER, fetchSearchCustomerSaga)]);
  yield all([takeLatest(FETCH_All_CUSTOMER, fetchAllCustomerSaga)]);

}

export default customerSaga;
