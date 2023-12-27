export interface BillManagementParamsSearch {
  page: number;
  pageSize: number;
  sorter: string;
  sortDirection: string;
  fromCreatedDate: string;
  toCreatedDate: string;
  code: string;
  posCode: string;
  receiptCode: string;
  fromMoneyAmount: number;
  toMoneyAmount: number;
  fromFee: number;
  toFee: number;
  fromEstimatedProfit: number;
  toEstimatedProfit: number;
  fromReturnedProfit: number;
  toReturnedProfit: number;
  fromReturnedTime: string;
  toReturnedTime: string;
}
export interface ColBillInfo {
  id: string;
  receipt: receiptInfo;
  code: string;
  fee: number;
  pos: posInfo;
  moneyAmount: number;
  estimatedProfit: number;
  returnedProfit: number;
  recordStatusEnum: string;
  returnedTime: string;
  createdBy: string;
  createdDate: string;
  timeStampOrder: number;
  posCardFee: number;
}
export interface receiptInfo {
  id: string;
  code: string;
}
export interface posInfo {
  id: string;
  code: string;
  maxBillAmount?: number;
}

export interface FilterBillParam {
  moneyAmount: number;
  posId: string;
  fromCreatedDate: string;
  toCreatedDate: string;
}
// export interface ColFilterBill {
//   moneyAmount: number;
//   posId: string;
//   fromCreatedDate: string;
//   toCreatedDate: string;
// }
export interface ColFilterBill {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  recordStatusEnum: string;
  id: string;
  code: string;
  timeStampSeq: number;
  moneyAmount: number;
  fee: number;
  estimatedProfit: number;
  returnedProfit: number;
  returnedTime: string;
  pos?: PosType;
}
export interface PosType {
  id: string;
  code: string;
  name: string;
  posStatus: string;
  address: string;
  accountNumber: string;
  bank: string;
  note: string;
  maxBillAmount: number;
}
export interface MatchBills {
  billIds: Array<string | number>;
  explanation: string;
  imageId: string;
}
