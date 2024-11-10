import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  count: 0,
  has_next: false,
  has_previous: false,
  page: 1,
  per_page: 10,
  result: [],
};

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {
    setFetchState(state, action: PayloadAction<any>) {
      console.log(action.payload);

      Object.assign(state, action.payload);
    },
  },
});

export const { setFetchState } = fetchSlice.actions;

export default fetchSlice.reducer;
