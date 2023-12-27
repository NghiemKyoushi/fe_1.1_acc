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
  supportedCardTypes: Array<SupportedCardTypesParam>;
}

export interface PosParamBodySend {
  code: string;
  name?: string;
  posStatus: string;
  address: string;
  accountNumber: string;
  bank: string;
  maxBillAmount?: string;
  supportedCardTypes: Array<ColCardType>;
}
export interface SupportedCardTypesParam {
  id: string;
  cardType?: cardType;
  // cardTypeId?: string;
  posCardFee?: number;
}

export interface ColCardType {
  id?: string;
  cardTypeId?: string;
  name?: string;
  posCardFee?: number;
}
export interface cardType {
  id: string;
  name: string;
}

export interface FormParams {
  code: string;
  name: string;
  address: string;
  accountNumber: string;
  bank: string;
  maxBillAmount: string;
  posFeeTable: Array<ColCardType>;
}
