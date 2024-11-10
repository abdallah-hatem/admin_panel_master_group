import type { LoginParams, LoginResult, LogoutParams, LogoutResult } from '../interface/user/login';

import { ApiBaseUrl, request } from './request';

type ChangePassword = {
  old_password: string;
  new_password: string;
};

export const apiLogin = (data: LoginParams) =>
  request<LoginResult>('post', `${ApiBaseUrl}/tokens`, data, {
    auth: data,
  });

export const apiLogout = (params: LogoutParams) => request<LogoutResult>('delete', `${ApiBaseUrl}/tokens`, params);

export const UPDATE_USER = (id: number | string, data: any) => request<any>('put', `${ApiBaseUrl}/users/${id}`, data);

export const GET_USER_BY_ID = (id: number | string) => request<any>('get', `${ApiBaseUrl}/users/${id}`);

export const RECOVER_PASSWORD = (id: number | string, data: any) =>
  request<any>('post', `${ApiBaseUrl}/users/${id}/recover_password`, data);

export const ASK_RECOVER_PASSWORD = (data: { email: string }) =>
  request<any>('post', `${ApiBaseUrl}/users/recover_password`, data);

export const RECOVER_PASSWORD_BY_TOKEN = (data: { token: string; password: string }) =>
  request<any>('put', `${ApiBaseUrl}/users/recover_password`, data);

export const CHANGE_PASSWORD = (id: number | string, data: ChangePassword) =>
  request<any>('post', `${ApiBaseUrl}/users/${id}/change_password`, data);

export const CHANGE_USERS_LOCALE = ({ data }: { data: { locale: string } }) =>
  request<any>('put', `${ApiBaseUrl}/users/change_locale`, data);

export const COMPLETE_REGISTRATION = (data: any) =>
  request<any>('post', `${ApiBaseUrl}/users/complete_registration`, data);

export const GET_USER_BY_TOKEN = ({ token }: { token: string }) =>
  request<any>('get', `${ApiBaseUrl}/users/token/${token}`);

export const VERIFY_EMAIL = (data: any) => request<any>('post', `${ApiBaseUrl}/users/verify_email`, data);
