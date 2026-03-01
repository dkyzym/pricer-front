import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  isClarifying: false,
  isLoading: false,
  error: null,
  clarifyingArticle: '',
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
      state.clarifyingArticle = '';
    },
    setBrandClarificationError(state, action) {
      state.error = action.payload;
      state.isClarifying = false;
    },
    setLoading(state) {
      state.isLoading = true;
    },
    unsetLoading(state) {
      state.isLoading = false;
    },
    setClarifyingArticle(state, action) {
      state.clarifyingArticle = action.payload;
    },
  },
});

export const {
  setBrandClarifications,
  clearBrandClarifications,
  setBrandClarificationError,
  setLoading,
  unsetLoading,
  setClarifyingArticle,
} = brandClarificationSlice.actions;

export default brandClarificationSlice.reducer;
