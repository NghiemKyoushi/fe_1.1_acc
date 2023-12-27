import { authApi } from "../authApi";

export const fetchAccEntryList = (param: any) => {
  return authApi.get("/api/entryTypes");
};

export const createAccEntryList = (title: string) => {
  return authApi.post(`/api/entryTypes?title=${title}`);
};

export const updateAccEntryList = (body: { id: string; title: string }) => {
  return authApi.put(`/api/entryTypes`, body);
};
export const deleteAccEntry = (id: string) => {
  return authApi.delete(`/api/entryTypes/${id}`);
};
