import type { Role } from '@/generic/interface/user/login';
import type { Locale, UserState } from '@/generic/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { getGlobalState } from '@/generic/utils/getGloabal';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem('t') ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
  userNavPermissions: JSON.parse(localStorage.getItem('userNavPermissions')!) || [],
  userPermissionRoutes: JSON.parse(localStorage.getItem('userPermissionRoutes')!) || [],
  userProfile: JSON.parse(localStorage.getItem('userProfile')!) || null,
  verifyEmailToken: localStorage.getItem('verifyEmailToken') || '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      const { username, userProfile, userNavPermissions } = action.payload;

      if (username !== state.username) localStorage.setItem('username', username ?? '');

      if (userProfile) localStorage.setItem('userProfile', JSON.stringify(userProfile));

      if (userNavPermissions) localStorage.setItem('userNavPermissions', JSON.stringify(userNavPermissions));

      Object.assign(state, action.payload);
    },
    setUserPermissionRoutes(state, action: PayloadAction<string[]>) {
      console.log(action.payload);

      localStorage.setItem('userPermissionRoutes', JSON.stringify(action.payload));
    },
    setVerifyEmailToken(state, action: PayloadAction<string>) {
      localStorage.setItem('verifyEmailToken', action.payload);

      state.verifyEmailToken = action.payload;
    },
  },
});

export const { setUserItem, setUserPermissionRoutes, setVerifyEmailToken } = userSlice.actions;

export default userSlice.reducer;
