import type { LoginParams } from '../interface/user/login';
import type { Dispatch } from '@reduxjs/toolkit';

import { apiLogin, apiLogout } from '@/generic/api/user.api';

import { setUserItem, setVerifyEmailToken } from './user.store';
import { createAsyncAction } from './utils';
// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
  return async dispatch => {
    const { result, status } = await apiLogin(payload);

    console.log(result);

    if (result) {
      localStorage.setItem('t', result.access_token);
      dispatch(
        setUserItem({
          logged: true,
          username: result.profile.username,
          userProfile: result.profile,
          userNavPermissions: result.profile.new_nav_permissions,
        }),
      );

      return true;
    }

    return false;
  };
});

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const res: any = await apiLogout({ token: localStorage.getItem('t')! });

    if (!res.status) {
      localStorage.clear();
      dispatch(setVerifyEmailToken(''));

      localStorage.removeItem('t');
      localStorage.removeItem('userNavPermissions');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('username');
      localStorage.removeItem('verifyEmailToken');

      dispatch(
        setUserItem({
          logged: false,
        }),
      );

      return true;
    }

    return false;
  };
};
