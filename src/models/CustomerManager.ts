export interface CustomerSearchByName {
  name: string;
  id: string;
  nationalId: string;
}

export interface CustomerSearchByNameParams {
  customerName: string;
}
export interface CustomerParams {
  page?: number;
  pageSize?: number;
  sorter?: string;
  sortDirection?: string;
  name?: string;
  phoneNumber?: string;
  nationalId?: string;
}
export interface ColCustomer {
  name: string;
  id: string;
  address: string;
  createdDate: string;
  phoneNumber: string;
  nationalId: string;
  percentageFee: number;
  note: string;
}
export interface NewCustomer {
  id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  nationalId: string;
  percentageFee: number;
  note: string;
}
