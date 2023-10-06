export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  userPhoneNumber: string;
  roles: Array<any>;
  branches: Array<any>;
}
export interface GenericResponse {
  status: string;
  message: string;
}
export interface ILoginResponse {
  status: string;
  access_token: string;
}
export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}
