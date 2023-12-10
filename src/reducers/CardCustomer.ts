import {
  FETCH_ALL_CARD,
  FETCH_ALL_CARD_SUCCESS,
  FETCH_CARD_CUSTOMER,
  FETCH_CARD_CUSTOMER_SUCCESS,
  FETCH_CREATE_CARD_CUSTOMER,
  FETCH_CREATE_CARD_CUSTOMER_FAILURE,
  FETCH_CREATE_CARD_CUSTOMER_SUCCESS,
} from "@/constants/CardCustomerManagement";

const initialState = {
  isLoading: false,
  cardCustomerList: [],
  cardType: [],
  cardList: [],
  createCardResponse: {},
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
            values: item.name,
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
        };
      });
      return {
        ...state,
        cardList: resultCard,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CardCustomertReducers;
