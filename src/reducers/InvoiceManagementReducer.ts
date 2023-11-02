import {
  FETCH_INVOICE,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_SUCCESS,
  FETCH_POS,
  FETCH_POS_SUCCESS,
} from "@/constants/InvoiceManagement";

const initialState = {
  isLoading: false,
  listOfInvoice: {},
  pagination: {
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    size: 0,
  },
  error: null,
  posList: [],
};
export interface invoiceActionprops {
  type: string;
  payload: any;
}
const InvoiceManagementReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_INVOICE:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_INVOICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listOfInvoice: action.payload,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };
    case FETCH_INVOICE_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: "",
        error: action.payload.error,
      };

    case FETCH_POS:
      return {
        ...state,
      };
    case FETCH_POS_SUCCESS:
      console.log("action.payload", action.payload)
      return {
        ...state,
        posList: action.payload.data
      };
    default:
      return {
        ...state,
      };
  }
};

export default InvoiceManagementReducers;
