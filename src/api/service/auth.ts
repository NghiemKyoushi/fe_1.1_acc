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
  try {
    await Promise.all([
      cookieSetting.clear("token"),
      cookieSetting.clear("userName"),
      cookieSetting.clear("employeeId"),
      cookieSetting.clear("roles"),
      cookieSetting.clear("branchName"),
      cookieSetting.clear("branchId"),
    ]);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
