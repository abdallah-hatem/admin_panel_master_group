import type { Role } from './login';
import type { Device } from '@/generic/interface/layout/index.interface';
import type { MenuChild } from '@/generic/interface/layout/menu.interface';

export type Locale = 'pt_PT' | 'en_US' | 'fr_FR';

export interface UserState {
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** notification count */
  noticeCount: number;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  userNavPermissions: object[];

  userPermissionRoutes: any;

  userProfile: any;

  verifyEmailToken: string;
}
