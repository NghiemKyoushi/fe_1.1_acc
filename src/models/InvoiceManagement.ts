export interface ReceiptParamsConditions {
  page: number;
  pageSize: number;
  sorter: string;
  sortDirection: string;
  employeeId?: string;
  employeeCode?: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  receiptCode?: string;
  cardName?: string;
  fromTransactionTotal?: number;
  toTransactionTotal?: number;
  fromIntake?: number;
  toIntake?: number;
  fromPayout?: number;
  toPayout?: number;
  fromLoan?: number;
  toLoan?: number;
  fromRepayment?: number;
  toRepayment?: number;
  fromEstimatedProfit?: number;
  toEstimatedProfit?: number;
  fromCalculatedProfit?: number;
  toCalculatedProfit?: number;
  // receiptStatusList: Array<any>;
}
export interface ReceiptCreationParams {
  imageId: string;
  branchId: string;
  customerCardId: string;
  percentageFee: number;
  shipmentFee: number;
  intake: number;
  payout: number;
  loan: number;
  repayment: string;
  employeeId: string;
  receiptBills: [];
}
export interface BillCreationParams {
  billId: string;
  posId: string;
  moneyAmount: number;
  fee: number;
  estimatedProfit: number;
}

export interface BillInfo {
  fee: number;
  posCode: string;
  restOfMoney: number;
  moneyAmount: number;
}
export interface InvoiceDetail {
  sumInvoice: number;
  shipmentFee: number;
  receiptCode: string;
  percentageFee: number;
  receiptId: string;
  receiptStatus: string;
  bill: Array<BillInfo>;
}
export interface InvoiceConfirmParams {
  receiptId: string;
  explanation: string;
}

export enum STATUS_CODE {
  PENDING = "PENDING",
  APPROVE = "APPROVED",
}

export interface ReceiptList {
  totalElements: number;
  size: 0;
  content: Array<ColReceiptList>;
  pageNumber: 0;
}

export interface ColReceiptList {
  id: string;
  code: string;
  createdDate: string;
  receiptStatusEnum: string;
  percentageFee: number;
  shipmentFee: number;
  intake: number;
  payout: number;
  loan: number;
  repayment: number;
  transactionTotal: number;
  calculatedProfit: number;
  estimatedProfit: number;
  customerCardId: string;
  customerCardName: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  branchName: string;
}
