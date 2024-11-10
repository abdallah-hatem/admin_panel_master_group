/** user's role */
export type Role = 'guest' | 'admin';

export interface LoginParams {
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
}

type MenueItems = {
  route: string;
  label: string;
  icon: string;
  children?: MenueItems[];
};

type Profile = {
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  status: string;
  email: string;
  email_verified_at: string;
  inserted_at: string;
  role_ids: number[];
  roles: Role[];
  id: number;
  permissions_routes: { route: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE' }[];
  nav_permissions: string[];
  new_nav_permissions: MenueItems[];
};

export interface LoginResult {
  /** auth token */
  access_token: string;
  username: string;
  role: Role;

  profile: Profile;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  id?: number | string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}
