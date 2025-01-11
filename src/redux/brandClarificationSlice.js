import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  isClarifying: false,
  isLoading: false,
  error: null,
};

const brandClarificationSlice = createSlice({
  name: 'brandClarification',
  initialState,
  reducers: {
    setBrandClarifications(state, action) {
      state.brands = action.payload;
      state.isClarifying = true;
      state.error = null;
    },
    clearBrandClarifications(state) {
      state.brands = [];
      state.isClarifying = false;
      state.error = null;
    },
    setBrandClarificationError(state, action) {
      state.error = action.payload;
      state.isClarifying = false;
    },
    setLoading(state) {
      // Экшен  начала загрузки
      state.isLoading = true;
    },
    unsetLoading(state) {
      // Экшен окончания загрузки
      state.isLoading = false;
    },
  },
});

export const {
  setBrandClarifications,
  clearBrandClarifications,
  setBrandClarificationError,
  setLoading,
  unsetLoading,
} = brandClarificationSlice.actions;

export default brandClarificationSlice.reducer;
