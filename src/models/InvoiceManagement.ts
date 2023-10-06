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
