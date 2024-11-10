import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

type State = {
  selectDefValue: string;
  currentRecored: any;
  currentConceptId: string | number | null;
  createButtonClickCount: number;
};

const initialState: State = {
  selectDefValue: '',
  currentRecored: null,
  currentConceptId: null,
  createButtonClickCount: 0,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setDefValue(state, action: PayloadAction<any>) {
      console.log(action.payload);

      state.selectDefValue = action.payload;

      // Object.assign(state, action.payload);
    },
    setCurrentRecored(state, action: PayloadAction<any>) {
      state.currentRecored = action.payload;
    },
    setCurrentConceptId(state, action: PayloadAction<any>) {
      state.currentConceptId = action.payload;
    },
    setCreateButtonClickCountPlusOne(state) {
      state.createButtonClickCount = state.createButtonClickCount + 1;
    },
  },
});

export const { setDefValue, setCurrentRecored, setCurrentConceptId, setCreateButtonClickCountPlusOne } =
  formSlice.actions;

export default formSlice.reducer;
