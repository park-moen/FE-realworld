import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { User } from './session.type';

type State = User | null;

export const sessionSlice = createSlice({
  name: 'session',
  initialState: null as State,
  reducers: {
    setSession: (_state, action: PayloadAction<State>) => action.payload,
    resetSession: () => null,
  },
  selectors: {
    selectSession: (state) => state,
  },
});

export const { setSession, resetSession } = sessionSlice.actions;
export const { selectSession } = sessionSlice.selectors;
