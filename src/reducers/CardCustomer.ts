import {
  FETCH_ALL_CARD,
  FETCH_ALL_CARD_SUCCESS,
  FETCH_CARD_CUSTOMER,
  FETCH_CARD_CUSTOMER_SUCCESS,
  FETCH_CREATE_CARD_CUSTOMER,
  FETCH_CREATE_CARD_CUSTOMER_FAILURE,
  FETCH_CREATE_CARD_CUSTOMER_SUCCESS,
  FETCH_LIST_CARD_CUSTOMER,
  FETCH_LIST_CARD_CUSTOMER_FAILURE,
  FETCH_LIST_CARD_CUSTOMER_SUCCESS,
} from "@/constants/CardCustomerManagement";

const initialState = {
  isLoading: false,
  cardCustomerList: [],
  cardType: [],
  cardList: [],
  createCardResponse: {},
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
    case FETCH_CARD_CUSTOMER:
      return {
        ...state,
      };
    case FETCH_CARD_CUSTOMER_SUCCESS:
      let result = [];
      if (action.payload.length > 0) {
        result = action.payload.map((item: any) => {
          return {
            values:
              item.name.toString() +
              " - " +
              item.accountNumber.toString().slice(-4),
            key: item.id,
            item: item,
          };
        });
      } else {
        result = [];
      }
      return {
        ...state,
        cardCustomerList: action.payload,
        cardType: result,
      };
    case FETCH_CREATE_CARD_CUSTOMER:
      return {
        ...state,
      };
    case FETCH_CREATE_CARD_CUSTOMER_SUCCESS:
      return {
        ...state,
      };
    case FETCH_CREATE_CARD_CUSTOMER_FAILURE:
      return {
        ...state,
      };
    case FETCH_ALL_CARD:
      return {
        ...state,
      };
    case FETCH_ALL_CARD_SUCCESS:
      let resultCard = [];
      resultCard = action.payload.map((item: any) => {
        return {
          values: item.name,
          key: item.id,
          id: item.id,
        };
      });
      return {
        ...state,
        cardList: resultCard,
      };

    case FETCH_LIST_CARD_CUSTOMER:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_LIST_CARD_CUSTOMER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cardCustomerList: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };
    case FETCH_LIST_CARD_CUSTOMER_FAILURE:
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

export default CardCustomertReducers;
