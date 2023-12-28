import { FETCH_BRANCH, FETCH_BRANCH_FAILURE, FETCH_BRANCH_SUCCESS } from "@/constants/BranchManagement";

  
  const initialState = {
    isLoading: false,
    branchList: [],
   
  };
  export interface invoiceActionprops {
    type: string;
    payload: any;
  }
  const BranchReducers = (
    state = initialState,
    action: invoiceActionprops
  ) => {
    switch (action.type) {
      case FETCH_BRANCH:
        return {
          ...state,
        };
      case FETCH_BRANCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          branchList: action.payload,
          error: null,
        };
  
      case FETCH_BRANCH_FAILURE:
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
  
  export default BranchReducers;
  