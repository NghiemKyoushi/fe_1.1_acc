// import { fetchSearchCustomerSuccess } from "@/actions/CustomerManagerAction";
import {
  fetchAllCardSuccess,
  fetchCardCustomerSuccess,
  fetchListCardCustomerSuccess,
} from "@/actions/CardCustomerActions";
import {
  fetchCardCustomer,
  fetchCardCustomerSearch,
  fetchGetAllCard,
} from "@/api/service/cardCustomerApis";
import { fetchCustomer } from "@/api/service/customerManagerApis";
import {
  FETCH_ALL_CARD,
  FETCH_CARD_CUSTOMER,
  FETCH_CREATE_CARD_CUSTOMER,
  FETCH_LIST_CARD_CUSTOMER,
} from "@/constants/CardCustomerManagement";
import { FETCH_SEARCH_CUSTOMER } from "@/constants/CustomerManagement";
import {
  CardCustomerInfor,
  ColCustomerCard,
  cardType,
} from "@/models/CardCustomerModel";
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
function* fetchListCardCustomerSaga(action: any) {
  try {
    const response: { data: ColCustomerCard[] } = yield call(
      fetchCardCustomer,
      action.payload
    );
    yield put(fetchListCardCustomerSuccess(response.data));
  } catch (e: any) {}
}

function* cardCustomerSaga() {
  yield all([takeLatest(FETCH_CARD_CUSTOMER, fetchCardCustomerSaga)]);
  yield all([
    takeLatest(FETCH_CREATE_CARD_CUSTOMER, fetchCreateCardCustomerSaga),
  ]);
  yield all([takeLatest(FETCH_ALL_CARD, fetchAllCardSaga)]);
  yield all([takeLatest(FETCH_LIST_CARD_CUSTOMER, fetchListCardCustomerSaga)]);

}

export default cardCustomerSaga;
