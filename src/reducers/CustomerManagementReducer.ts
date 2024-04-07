import {
  FETCH_ALL_CUSTOMER_SUCCESS,
  FETCH_All_CUSTOMER,
  FETCH_All_CUSTOMER_FAILURE,
  FETCH_SEARCH_CUSTOMER,
  FETCH_SEARCH_CUSTOMER_SUCCESS,
} from "@/constants/CustomerManagement";

const initialState = {
  isLoading: false,
  customerList: [],
  getCustomer: [],
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
            nationalId: item.nationalId,
            percentageFee: item.percentageFee,
          };
        });
      } else {
        result = [];
      }
      return {
        ...state,
        customerList: result,
      };
    case FETCH_All_CUSTOMER:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_ALL_CUSTOMER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        getCustomer: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };

    case FETCH_All_CUSTOMER_FAILURE:
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

export default CustomerManagementReducers;
