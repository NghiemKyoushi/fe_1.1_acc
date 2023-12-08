import { authApi } from "../authApi";

export const fetchAccEntryList = (param: any) => {
  return authApi.get("/api/entryTypes");
};
