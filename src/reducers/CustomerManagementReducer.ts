import { FETCH_SEARCH_CUSTOMER, FETCH_SEARCH_CUSTOMER_SUCCESS } from "@/constants/CustomerManagement";

const initialState = {
  isLoading: false,
  customerList: [],
};
export interface invoiceActionprops {
  type: string;
  payload: any;
}
const CustomerManagementReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_SEARCH_CUSTOMER:
      return {
        ...state,
      };
    case FETCH_SEARCH_CUSTOMER_SUCCESS:
      let result = [];
      if (action.payload.length > 0) {
        result = action.payload.map((item: any) => {
          return {
            values: item.name,
            key: item.id,
            nationalId: item.nationalId
          };
        });
      } else {
        result = [];
      }
      return {
        ...state,
        customerList: result,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CustomerManagementReducers;
