export interface ColumnType {
  createdDate: string;
  transactionTypeEnum: string;
  accountEntryCode: string;
  moneyAmount: string;
  explanation: number;
  purpose: string;
  imageId: number;
}

export interface AccountingBookSearchParams {
  branchId: string;
  entryBookDate: string;
  entryCodeSearchKey?: string;
  page: number;
  pageSize: number;
  sorter: SORT;
  sortDirection: SORTDIRECTION;
}

export interface CreateEntryParams {
  transactionTypeEnum: string;
  moneyAmount: number;
  purpose: string;
  explanation: string;
  branchId: string;
}

export enum SORT {
  EMPLOYEE = "EMPLOYEE",
  CREATED_DATE = "CREATED_DATE",
  POS = "POS",
  CUSTOMER_CARD = "CUSTOMER_CARD",
}
export enum SORTDIRECTION {
  ASC = "ASC",
  DESC = "DESC",
}
export enum TYPE_BOOK {
  DEPT = "DEPT",
  CREDIT = "CREDIT",
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}
export enum TYPE_PURPOSE {
  DEPT = "CÔNG NỢ",
  CREDIT = "THU NỢ",
  ADVANCE = "TẠM ỨNG",
  WITHDRAW = "ĐẢO RÚT",
}
