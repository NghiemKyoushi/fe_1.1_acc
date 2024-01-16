import {
  FETCH_BILL,
  FETCH_BILL_FAILURE,
  FETCH_BILL_SUCCESS,
  FETCH_FILTER_BILL,
  FETCH_FILTER_BILL_FAILURE,
  FETCH_FILTER_BILL_SUCCESS,
  FETCH_SUM_BILL,
  FETCH_SUM_BILL_FAILURE,
  FETCH_SUM_BILL_SUCCESS,
} from "@/constants/BillManagement";

const initialState = {
  isLoading: false,
  billsList: [],
  filterBill: [],
  totalSumRow: {
    createdBy: "",
    createdDate: "",
    recordStatusEnum: null,
    id: "111",
    code: null,
    timeStampSeq: "",
    moneyAmount: 0,
    fee: 0,
    returnedProfit: 0,
    returnedTime: null,
    posCode: "",
    receiptCode: "",
  },
  pagination: {
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    size: 0,
  },
};
export interface invoiceActionprops {
  type: string;
  payload: any;
}
const BillManagementReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_BILL:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_BILL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        billsList: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };

    case FETCH_BILL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_SUM_BILL:
      return {
        ...state,
      };
    case FETCH_SUM_BILL_SUCCESS:
      return {
        ...state,
        totalSumRow: {
          createdBy: "TOTAL",
          createdDate: "",
          recordStatusEnum: null,
          id: "11133",
          code: null,
          timeStampSeq: "",
          moneyAmount: action.payload.totalMoneyAmount,
          fee: 0,
          returnedProfit: action.payload.totalReturnedProfit,
          returnedTime: null,
          posCode: "",
          receiptCode: "",
        },
      };
    case FETCH_SUM_BILL_FAILURE:
      return {
        ...state,
      };
    case FETCH_FILTER_BILL:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_FILTER_BILL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        filterBill: action.payload,
        error: null,
      };

    case FETCH_FILTER_BILL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
};

export default BillManagementReducers;
