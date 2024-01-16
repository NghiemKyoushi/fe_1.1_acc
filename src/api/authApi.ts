import axios from "axios";
import { GenericResponse, ILoginResponse, IUserResponse } from "./types";
import { cookieSetting } from "../utils";

export const authApi = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Accept-Language": "vn",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  },
});
authApi.interceptors.request.use(
  function (config) {
    const token = cookieSetting.get("token");
    const test = "Bearer" + " " + token;
    config.headers.Authorization = token ? test : "";
    return config;
  },
  function (error) {
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
