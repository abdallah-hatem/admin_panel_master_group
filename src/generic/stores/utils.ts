import type { AppStore } from '@/generic/stores';
import type { Dispatch } from '@reduxjs/toolkit';

type ThunkAction<T = any> = (dispatch: Dispatch, state: AppStore['getState']) => Promise<T>;

export const createAsyncAction = <T = any, R = any>(cb: (arg: T) => ThunkAction<R>) => {
  return cb;
};
