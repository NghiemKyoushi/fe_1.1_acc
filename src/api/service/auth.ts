import { cookieSetting } from "@/utils";
import { authApi } from "../authApi";

interface loginProps {
  code: string;
  password: string;
}
export const loginUserFn = async (user: loginProps) => {
  const response = await authApi.post("/api/auth/login", user);
  return response.data;
};
export const logoutUserFn = async () => {
  await cookieSetting.clear("token");
  await cookieSetting.clear("userName");
  await cookieSetting.clear("employeeId");

  await cookieSetting.clear("branchId");
};
