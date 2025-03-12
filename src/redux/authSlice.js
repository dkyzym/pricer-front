import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
    },
    finishCheckingAuth: (state) => {
      state.isCheckingAuth = false;
    },
  },
});

export const { setUser, logout, finishCheckingAuth } = authSlice.actions;
export default authSlice.reducer;
