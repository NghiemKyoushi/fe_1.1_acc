export interface PosSearchParams {
  page?: number;
  pageSize?: number;
  sorter?: string;
  sortDirection?: string;
  code?: string;
  name?: string;
  accountNumber?: string;
  bank?: string;
  fromMaxBillAmount?: number;
  toMaxBillAmount?: number;
}
export interface ColPosManagement {
  id: string;
  code: string;
  name: string;
  posStatus: string;
  address: string;
  accountNumber: string;
  bank: string;
  note: string;
  maxBillAmount: number;
  supportedCardTypes: Array<any>;
}

export interface PosParamBodySend {
  code: string;
  name?: string;
  posStatus: string;
  address: string;
  accountNumber: string;
  bank: string;
  maxBillAmount?: string;
  supportedCardTypes: Array<SupportedCardTypesParam>;
}
export interface SupportedCardTypesParam {
  // id: string;
  cardTypeId: string;
  posCardFee: number;
}

export interface ColCardType {
  id: number;
  cardTypeId: string;
  name: string;
  posCardFee: string;
}
