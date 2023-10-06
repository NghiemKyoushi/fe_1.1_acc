import axios from 'axios';
import { GenericResponse, ILoginResponse, IUserResponse } from './types';
import { cookieSetting } from '../utils';

export const authApi = axios.create({
    baseURL: process.env.BASE_URL,
    // headers: {
    //   "Content-Type": "application/json",
    //   "Access-Control-Allow-Origin": "*",
    // },
  });
  authApi.interceptors.request.use(
    function (config) {
      const token = cookieSetting.get("token");
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  
  authApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
    //   const originalRequest = error.config;
    //   const errMessage = error.response.data.message as string;
    //   if (errMessage.includes('not logged in') && !originalRequest._retry) {
    //     originalRequest._retry = true;
    //     // await refreshAccessTokenFn();
    //     return authApi(originalRequest);
    //   }
      return Promise.reject(error);
    }
  );

//   export const signUpUserFn = async (user: RegisterInput) => {
//     const response = await authApi.post<GenericResponse>('auth/register', user);
//     return response.data;
//   };
  // interface loginProps{
  //   usernameOrEmail: string,
  //   password: string

  // }
  // export const loginUserFn = async (user: loginProps) => {
  //   const response = await authApi.post('/api/auth/login', user);
  //   return response.data;
  // };
  
  // export const logoutUserFn = async () => {
  //   await cookieSetting.clear('userId');
  //   await cookieSetting.clear('token');
  // };
  // interface userProps{
  //   userId: string,

  // }
  // export const getMeFn = async () => {
  //   const userId = cookieSetting.get('userId');
  //   const response = await authApi.get(`api/users/${userId}`);
  //   return response.data;
  // };
  