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
}
export interface SearchForm {
  key: string;
  value: string;
}
export interface cardType {
  id: string;
  name: string;
}
