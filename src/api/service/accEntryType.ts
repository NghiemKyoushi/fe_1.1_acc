import { authApi } from "../authApi";

export const fetchAccEntryList = (param: any) => {
  return authApi.get("/api/entryTypes");
};

export const createAccEntryList = (body: {
  title: string;
  transactionType: string;
}) => {
  return authApi.post(`/api/entryTypes`, body);
};

export const getAccEntryApis = (title: string, transactionType: string) => {
  return authApi.get(
    `/api/entryTypes/findByTitle/${title}?transactionType=${transactionType}`
  );
};

export const updateAccEntryList = (body: { id: string; title: string }) => {
  return authApi.put(`/api/entryTypes`, body);
};
export const deleteAccEntry = (id: string) => {
  return authApi.delete(`/api/entryTypes/${id}`);
};
