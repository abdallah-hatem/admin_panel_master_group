import { ApiBaseUrl, request } from '@/generic/api/request';

////////////////// Roles //////////////////

// Get roles
export const GET_ROLES = (params?: any) => request<any>('get', `${ApiBaseUrl}/roles`, params);

// Get roles 2
export const GET_ROLES_2 = (params?: any) => request<any>('get', `${ApiBaseUrl}/suggestions/roles`, params);

// Get role by id
export const GET_ROLES_BY_ID = ({ id, params }: { id: string | number; params?: any }) =>
  request<any>('get', `${ApiBaseUrl}/roles/${id}`, params);

// Add role
export const ADD_ROLE = (data: any) => request<any>('post', `${ApiBaseUrl}/roles`, data);

// Delete role
export const DELETE_ROLE = (id: number) => request<any>('delete', `${ApiBaseUrl}/roles/${id}`);

// Update role
export const UPDATE_ROLE = (id: number, data: any) => request<any>('put', `${ApiBaseUrl}/roles/${id}`, data);

// Get permissions by role by id
export const GET_PERMISSIONS_BY_ROLE_ID: any = ({ id, params }: { id: string | number; params?: any }) =>
  request<any>('get', `${ApiBaseUrl}/roles/${id}/permissions`, params);

// Add permissions by role by id
export const ADD_PERMISSIONS_BY_ROLE_ID = (id: string, data: any, params?: any) =>
  request<any>('post', `${ApiBaseUrl}/roles/${id}/permissions`, data, params);
