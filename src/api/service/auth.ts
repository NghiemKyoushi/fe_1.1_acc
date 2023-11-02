import { authApi } from "../authApi";

  interface loginProps{
    code: string,
    password: string

  }
  export const loginUserFn = async (user: loginProps) => {
    const response = await authApi.post('/api/auth/login', user);
    return response.data;
  };