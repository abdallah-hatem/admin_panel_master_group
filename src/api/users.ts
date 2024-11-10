import { ApiBaseUrl, request } from '@/generic/api/request';

// Get users
export const GET_USERS = (params?: any) => request<any>('get', `${ApiBaseUrl}/users`, params);

// Get active users
export const GET_ACTIVE_USERS = (params?: any) => request<any>('get', `${ApiBaseUrl}/users?status=active`, params);

// Get user by id
export const GET_USERS_BY_ID = ({ id, params }: { id: string; params?: any }) =>
  request<any>('get', `${ApiBaseUrl}/users/${id}`, params);

// Add user
export const ADD_USER = (data: any) => request<any>('post', `${ApiBaseUrl}/users`, data);

// Delete user
export const ARCHIVE_USER = (id: number) => request<any>('delete', `${ApiBaseUrl}/users/${id}/archived`);

// Update user
export const UPDATE_USER = (id: number, data: any) => request<any>('put', `${ApiBaseUrl}/users/${id}`, data);
