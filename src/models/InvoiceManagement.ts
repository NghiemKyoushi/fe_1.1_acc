import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

export interface ReceiptParamsConditions {
  page: number;
  pageSize: number;
  sorter: string;
  sortDirection?: string;
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
  branchId?: string;
  customerCardId: string;
  percentageFee: number;
  shipmentFee: number;
  intake: number; //thu
  payout: number; // chi
  loan: number; // công nợ
  repayment: number; // thu nợ
  employeeId?: string;
  receiptBills: Array<BillCreationParams>;
  // note: string;
  usingCardPrePayFee: boolean;
  acceptExceededFee: boolean;
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
export interface ValueFormCreate {
  codeEmployee: string;
  customerInfo: string;
  customerName: Selection;
  imageId: string;
  posSearch: string;
  percentageFee: string;
  shipmentFee: string;
  cardCustomer: cardCustomerSelect;
  totalBill: string;
  invoices: Array<InvoiceCreate>;
  invoicesCalculate: Array<InvoicesCalculateType>;
  check: string;
  usingCardPrePayFee: boolean;
  acceptExceededFee: boolean;
  note: string;
  branchIds: PosDetail;
}
export interface InvoicesCalculateType {
  intake: number; //thu
  payout: number; // chi
  loan: number; // công nợ
  repayment: number; // thu nợ
}
export interface InvoiceCreate {
  id: string;
  pos?: PosDetail;
  posId: PosDetail;
  money: string;
  typeOfCard?: string;
  fee?: string;
  feeafterpay?: number;
  billcode?: string;
  check?: string;
  estimatedReturnFromBank?: number;
  returnFromBank: number;
  calculatedProfit?: string;
}
export interface PosDetail {
  key: string;
  values: string;
}
export interface InvoiceSumTotal {
  total: number;
  totalIntake: number;
  totalPayout: number;
  totalLoan: number;
  totalRepayment: number;
  totalEstimatedProfit: number;
  totalCalculatedProfit: number;
}
export interface Selection {
  key: string;
  values: string;
  nationalId: string;
}
export interface cardCustomerSelect {
  key: string;
  values: string;
}
export interface InvoiceConfirmParams {
  receiptId: string;
  explanation: string;
}
export interface RepayConfirmParams {
  receiptId: string;
  explanation: string;
  repaidAmount: number;
  imageId: string;
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
  customerCardNumber: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  branchName: string;
  note: string;
}
export interface RangeNumberFilterProps<
  TFieldValues extends FieldValues = FieldValues
> {
  fromNumberName: string;
  toNumberName: string;
  register: UseFormRegister<any>;
  handleSearch: () => void;
}
export interface InvoiceConfirmParams {
  receiptId: string;
  explanation: string;
  imageId: string;
}
export interface ConfirmRepayParams {
  receiptId: string;
  explanation: string;
  repaidAmount: number;
  imageId: string;
}
export enum ACTION_TYPE {
  CREATE = "C",
  DELETE = "D",
  EDIT = "E",
  VIEW = "V",
}
export interface InfoCard {
  cardType: string;
  bank: string;
  accountNumber: string;
  prePaidFee: number;
}
