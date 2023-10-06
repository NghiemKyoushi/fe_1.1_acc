

import { FETCH_INVOICE, FETCH_INVOICE_FAILURE, FETCH_INVOICE_SUCCESS } from "@/constants/InvoiceManagement";

const initialState = {
  isLoading: false,
  listOfInvoice: [],
  error: null,
};
export interface invoiceActionprops{
  type:string;
  payload: any
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
        error: null,
      };
    case FETCH_INVOICE_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: "",
        error: action.payload.error,
      };
    default:
      return {
        ...state,
      };
  }
};

export default InvoiceManagementReducers;
