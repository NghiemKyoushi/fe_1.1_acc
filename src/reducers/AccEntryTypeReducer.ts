import {
  FETCH_ACC_ENTRY_TYPE,
  FETCH_ACC_ENTRY_TYPE_FAILURE,
  FETCH_ACC_ENTRY_TYPE_SUCCESS,
} from "@/constants/AccEntryType";

const initialState = {
  isLoading: false,
  accEntryTypeList: [],
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
const AccEntryTypeReducers = (
  state = initialState,
  action: invoiceActionprops
) => {
  switch (action.type) {
    case FETCH_ACC_ENTRY_TYPE:
      return {
        ...state,
      };
    case FETCH_ACC_ENTRY_TYPE_SUCCESS:
      return {
        ...state,
        accEntryTypeList: action.payload,
      };
    case FETCH_ACC_ENTRY_TYPE_FAILURE:
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

export default AccEntryTypeReducers;
