import {
  FETCH_CREATE_EMP,
  FETCH_CREATE_EMP_FAILURE,
  FETCH_CREATE_EMP_SUCCESS,
  FETCH_EMP,
  FETCH_EMP_FAILURE,
  FETCH_EMP_SUCCESS,
} from "@/constants/EmpManagement";

const initialState = {
  isLoading: false,
  empList: [],
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
    case FETCH_EMP:
      return {
        ...state,
      };
    case FETCH_EMP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        empList: action.payload.content,
        pagination: {
          totalPages: action.payload.totalPages,
          pageNumber: action.payload.pageable.pageNumber,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
        },
        error: null,
      };

    case FETCH_EMP_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_CREATE_EMP:
      return {
        ...state,
      };
    case FETCH_CREATE_EMP_SUCCESS:
      return {
        ...state,
      };
    case FETCH_CREATE_EMP_FAILURE:
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CardCustomertReducers;
