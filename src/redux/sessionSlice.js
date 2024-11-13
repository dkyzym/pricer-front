import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessions(state, action) {
      state.sessions = action.payload;
      state.error = null;
    },
    setSessionError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setSessions, setSessionError } = sessionSlice.actions;

export default sessionSlice.reducer;
