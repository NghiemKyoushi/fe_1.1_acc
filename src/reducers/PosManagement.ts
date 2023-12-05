import {
  FETCH_CARD_CUSTOMER,
  FETCH_CARD_CUSTOMER_SUCCESS,
} from "@/constants/CardCustomerManagement";
import {
  FETCH_POS_MANAGEMENT,
  FETCH_POS_MANAGEMENT_SUCCESS,
} from "@/constants/PosManagement";

const initialState = {
  isLoading: false,
  posList: [],
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
const CardCustomertReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_POS_MANAGEMENT:
      return {
        ...state,
      };
    case FETCH_POS_MANAGEMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posList: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CardCustomertReducers;
