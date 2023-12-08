
import {
  FETCH_GEN_ACCOUNT_BOOK,
  FETCH_GEN_ACCOUNT_BOOK_FAILURE,
  FETCH_GEN_ACCOUNT_BOOK_SUCCESS,
  FETCH_GEN_SUM_ACCOUNT_BOOK,
  FETCH_GEN_SUM_ACCOUNT_BOOK_FAILURE,
  FETCH_GEN_SUM_ACCOUNT_BOOK_SUCCESS,
} from "@/constants/GenAccountBookMamagement";

const initialState = {
  isLoading: false,
  genAccBookList: [],
  totalSumRow: {
    createdBy: "",
    createdDate: "",
    lastModifiedBy: "",
    lastModifiedDate: "",
    recordStatusEnum: "",
    id: "1212",
    entryCode: "TOTAL",
    transactionType: "",
    entryType: "",
    moneyAmount: 0,
    entryStatus: "",
    explanation: "",
    // branch: {},
    imageId: "",
    intake: 0, //thu
    payout: 0, // chi
    loan: 0, // công nợ
    repayment: 0,
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
const GenAccBookReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_GEN_ACCOUNT_BOOK:
      return {
        ...state,
      };
    case FETCH_GEN_ACCOUNT_BOOK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        genAccBookList: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };

    case FETCH_GEN_ACCOUNT_BOOK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_GEN_SUM_ACCOUNT_BOOK:
      return {
        ...state,
      };
    case FETCH_GEN_SUM_ACCOUNT_BOOK_SUCCESS:
      return {
        ...state,
        totalSumRow: {
          createdBy: "",
          createdDate: "",
          lastModifiedBy: "",
          lastModifiedDate: "",
          recordStatusEnum: "",
          id: "1212",
          entryCode: "TOTAL",
          transactionType: "",
          entryType: "",
          moneyAmount: action.payload.total,
          entryStatus: "",
          explanation: "",
          // branch: {},
          imageId: "",
          intake: action.payload.totalIntake,
          payout: action.payload.totalPayout,
          loan: action.payload.totalLoan,
          repayment: action.payload.totalRepayment,
        },
      };
    case FETCH_GEN_SUM_ACCOUNT_BOOK_FAILURE:
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

export default GenAccBookReducers;
