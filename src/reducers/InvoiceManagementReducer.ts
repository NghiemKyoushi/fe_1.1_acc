import {
  FETCH_INVOICE,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_SUCCESS,
  FETCH_POS,
  FETCH_POS_SUCCESS,
  FETCH_SUM_INVOICE,
  FETCH_SUM_INVOICE_FAILURE,
  FETCH_SUM_INVOICE_SUCCESS,
} from "@/constants/InvoiceManagement";

const initialState = {
  isLoading: false,
  isLoadingSum: false,
  listOfInvoice: [],
  pagination: {
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    size: 0,
  },
  totalSumRow: {
    id: "1",
    code: "TOTAL",
    createdDate: "",
    receiptStatusEnum: "",
    percentageFee: 0,
    shipmentFee: 0,
    intake: 0,
    payout: 0,
    loan: 0,
    repayment: 0,
    transactionTotal: 0,
    calculatedProfit: 0,
    estimatedProfit: 0,
    customerCardId: "",
    customerCardName: "",
    employeeId: "",
    employeeName: "",
    branchId: "",
    branchName: "",
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
        listOfInvoice: action.payload.content,
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
        error: action.payload.error,
      };
    case FETCH_SUM_INVOICE:
      return {
        ...state,
      };
    case FETCH_SUM_INVOICE_SUCCESS:
      return {
        ...state,
        error: null,
        totalSumRow: {
          id: "1",
          code: "TOTAL",
          createdDate: "",
          receiptStatusEnum: "",
          percentageFee: 0,
          shipmentFee: 0,
          intake: action.payload.totalIntake,
          payout: action.payload.totalPayout,
          loan: action.payload.totalLoan,
          repayment: action.payload.totalRepayment,
          transactionTotal:
            action.payload.total - action.payload.totalShipmentFee,
          calculatedProfit: action.payload.totalCalculatedProfit,
          estimatedProfit: action.payload.totalEstimatedProfit,
          customerCardId: "",
          customerCardName: "",
          employeeId: "",
          employeeName: "",
          branchId: "",
          branchName: "",
        },
      };
    case FETCH_SUM_INVOICE_FAILURE:
      return {
        ...state,
      };
    case FETCH_POS:
      return {
        ...state,
      };
    case FETCH_POS_SUCCESS:
      return {
        ...state,
        posList: action.payload.data,
      };
    default:
      return {
        ...state,
      };
  }
};

export default InvoiceManagementReducers;
