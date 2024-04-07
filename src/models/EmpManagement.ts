export interface EmpManageParamSearch {
  page?: number;
  pageSize?: number;
  sorter?: string;
  sortDirection?: string;
  id?: string;
  code?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  branchCode?: string;
  roleTitle?: string;
}
export interface EmpManageSearchResult {
  id: string;
  name: string;
  code: string;
  email: string;
  phoneNumber: string;
  branchCode: string;
  roleTitle: string;
  accountBalance: number;
}

export interface NewUserPrarams {
  name?: string;
  code?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleIds: Array<any>;
  branchIds?: Array<any>;
  salary?: string;
  bank: string;
  accountNumber: string;
}
export interface EditUserPrarams {
  name?: string;
  code?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleIds: Array<any>;
  saveBranchManagementConfigRequests?: Array<any>;
  salary?: string;
  bank: string;
  accountNumber: string;
}
export interface valueForm {
  name?: string;
  phoneNumber?: string;
  code?: string;
  branchIds?: Array<any>;
  roleIds?: SearchForm;
  startDate?: Date;
  email?: string;
  salary: string;
  password?: string;
  restOfMoney?: string;
  accountBalance?: string;
  bank: string;
  accountNumber: string;
  newPassword: string;
}
export interface SearchForm {
  keys: string;
  values: string;
}
