// import { fetchSearchCustomerSuccess } from "@/actions/CustomerManagerAction";
import {
  fetchAllCardSuccess,
  fetchCardCustomerSuccess,
} from "@/actions/CardCustomerActions";
import {
  fetchCardCustomerSearch,
  fetchGetAllCard,
} from "@/api/service/cardCustomerApis";
import { fetchCustomer } from "@/api/service/customerManagerApis";
import {
  FETCH_ALL_CARD,
  FETCH_CARD_CUSTOMER,
  FETCH_CREATE_CARD_CUSTOMER,
} from "@/constants/CardCustomerManagement";
import { FETCH_SEARCH_CUSTOMER } from "@/constants/CustomerManagement";
import { CardCustomerInfor, cardType } from "@/models/CardCustomerModel";
import { CustomerSearchByName } from "@/models/CustomerManager";
import { all, call, put, takeLatest } from "redux-saga/effects";

function* fetchCardCustomerSaga(action: any) {
  try {
    const response: { data: CardCustomerInfor[] } = yield call(
      fetchCardCustomerSearch,
      action.payload
    );
    yield put(fetchCardCustomerSuccess(response?.data));
  } catch (e: any) {}
}
function* fetchCreateCardCustomerSaga(action: any) {
  try {
    // const response: { data: CardCustomerInfor[] } = yield call(
    //   ,
    //   action.payload
    // );
    // yield put(fetchCardCustomerSuccess(response?.data));
  } catch (e: any) {}
}
function* fetchAllCardSaga(action: any) {
  try {
    const response: { data: cardType[] } = yield call(fetchGetAllCard);
    yield put(fetchAllCardSuccess(response.data));
  } catch (e: any) {}
}

function* cardCustomerSaga() {
  yield all([takeLatest(FETCH_CARD_CUSTOMER, fetchCardCustomerSaga)]);
  yield all([
    takeLatest(FETCH_CREATE_CARD_CUSTOMER, fetchCreateCardCustomerSaga),
  ]);
  yield all([takeLatest(FETCH_ALL_CARD, fetchAllCardSaga)]);
}

export default cardCustomerSaga;
