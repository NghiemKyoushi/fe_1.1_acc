export interface CardCustomerSearchById {
  name: string;
  id: string;
  code: string;
}
export interface CardCustomerParams {
  customerId: string;
}
export interface CardCustomerInfor {
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  cardType: cardType;
  accountNumber: string;
  bank: string;
  paymentLimit: string;
  paymentDueDate: string;
}
export interface NewCardType {
  name: string;
  cardTypeId: string;
  accountNumber: string;
  bank: string;
  paymentLimit: number;
  paymentDueDate: string;
  customerId: string;
}
export interface NewCardTypeFrorm {
  name: string;
  cardTypeId: SearchForm;
  accountNumber: string;
  bank: string;
  paymentLimit: string;
  paymentDueDate: string;
  customerId: SearchForm;
  // nationalId: string;
  expireDate: Date;
  note: string;
  prePaidFee?: string;
}
export interface CustomerCardSearch {
  page: number;
  pageSize: number;
  sorter: string;
  sortDirection: string;
  customerName: string;
  name: string;
  cardTypeIds: Array<string>;
  bank: string;
  nationalId: string;
  fromPaymentLimit: number;
  toPaymentLimit: number;
  fromPaymentDueDate: string;
  toPaymentDueDate: string;
}
export interface ColCustomerCard {
  name: string;
  id: string;
  cardType: CardType;
  accountNumber: string;
  bank: string;
  paymentLimit: number;
  paymentDueDate: string;
  createdDate: string;
  customer: customerType;
}
export interface ColCustomerCardDetail {
  name: string;
  id: string;
  cardType: string;
  accountNumber: string;
  bank: string;
  paymentLimit: number;
  paymentDueDate: string;
  createdDate: string;
  customerName: string;
}
export interface customerType {
  name: string;
  id: string;
  nationalId?: string;
}
export interface CardType {
  name: string;
  id: string;
}
export interface SearchForm {
  key: string;
  values: string;
}
export interface cardType {
  id: string;
  name: string;
}
export interface PayFeeType {
  customerCardId: string;
  prePaidFee: string;
  imageId: string;
  branchId: string;
}
