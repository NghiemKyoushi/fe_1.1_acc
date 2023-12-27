export interface ColumnType {
  createdDate: string;
  transactionTypeEnum: string;
  accountEntryCode: string;
  moneyAmount: string;
  explanation: number;
  purpose: string;
  imageId: number;
}
export interface ColAccountBook {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  recordStatusEnum: string;
  id: string;
  entryCode: string;
  transactionType: string;
  entryType: string;
  moneyAmount: number;
  entryStatus: string;
  explanation: string;
  branch: BranchType;
  imageId: string;
  intake: number; //thu
  payout: number; // chi
  loan: number; // công nợ
  repayment: number; // thu nợ
}
export interface BranchType {
  id: string;
  name: string;
  code: string;
  phoneNumber: string;
  accountNumber: string;
  bank: string;
}
export interface AccountingBookSearchParams {
  branchId?: string;
  entryBookDate?: string;
  entryCodeSearchKey?: string;
  page: number;
  pageSize: number;
  sorter: string;
  sortDirection: string;
}

export interface CreateEntryParams {
  transactionType: string;
  entryType: string;
  moneyAmount: number;
  imageId: string;
  explanation: string;
  branchId?: string;
}
