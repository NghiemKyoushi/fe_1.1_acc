import { fetchCardCustomerSuccess } from "@/actions/CardCustomerActions";
import { fetchSearchCustomerSuccess } from "@/actions/CustomerManagerAction";
import { fetchCustomer } from "@/api/service/customerManagerApis";
import { FETCH_SEARCH_CUSTOMER } from "@/constants/CustomerManagement";
import { CustomerSearchByName } from "@/models/CustomerManager";
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

function* customerSaga() {
  yield all([takeLatest(FETCH_SEARCH_CUSTOMER, fetchSearchCustomerSaga)]);
}

export default customerSaga;
