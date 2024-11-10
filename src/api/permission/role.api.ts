import type { GetRoleResult } from '@/generic/interface/permission/role.interface';

import { request } from '@/generic/api/request';

/** get role list api */
export const apiGetRoleList = () => request<GetRoleResult>('get', '/permission/role');
