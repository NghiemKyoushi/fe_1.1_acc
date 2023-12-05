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
}

export interface NewUserPrarams {
  name?: string;
  code?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleIds: Array<string>;
  branchIds?: Array<string>;
}
export interface valueForm {
  name?: string;
  phoneNumber?: string;
  code?: string;
  branchIds?: SearchForm;
  roleIds?: SearchForm;
  startDate?: Date;
  email?: string;
  salary?: string;
  password?: string;
}
export interface SearchForm {
  keys: string;
  values: string;
}
