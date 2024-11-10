import type { MenuList } from '@/generic/interface/layout/menu.interface';
import type { Notice } from '@/generic/interface/layout/notice.interface';
import type { AxiosRequestConfig } from 'axios';

import { request } from './request';

/** Provides the mock menu list to be shown in the navigation sidebar */
export const getMenuList = (config: AxiosRequestConfig = {}) => request<MenuList>('get', '/user/menu', {}, config);

/** Provides the mock notification list to be shown
 * in the notification dropdown
 */
export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', '/user/notice', {}, config);
