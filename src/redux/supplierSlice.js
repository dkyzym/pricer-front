import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supplierStatus: {},
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSupplierStatus(state, action) {
      state.supplierStatus = action.payload;
    },
    resetSupplierStatus(state) {
      Object.keys(state.supplierStatus).forEach((supplier) => {
        state.supplierStatus[supplier] = {
          ...state.supplierStatus[supplier],
          results: [],
          loading: false,
          error: null,
        };
      });
    },
    setSupplierStatusLoading(state, action) {
      const supplier = action.payload;
      state.supplierStatus[supplier] = {
        ...(state.supplierStatus[supplier] || {}),
        loading: true,
        error: null,
      };
    },
    setSupplierStatusSuccess(state, action) {
      const { supplier, results } = action.payload;
      state.supplierStatus[supplier] = {
        ...(state.supplierStatus[supplier] || {}),
        loading: false,
        results,
        error: null,
      };
    },
    setSupplierStatusError(state, action) {
      const { supplier, error } = action.payload;
      state.supplierStatus[supplier] = {
        ...(state.supplierStatus[supplier] || {}),
        loading: false,
        error,
      };
    },
    setSupplierArticle(state, action) {
      const { supplier, article } = action.payload;
      if (!state.supplierStatus[supplier]) {
        state.supplierStatus[supplier] = {
          results: [],
          loading: false,
          error: null,
        };
      }
      state.supplierStatus[supplier].article = article;
    },
  },
});

export const {
  setSupplierStatus,
  resetSupplierStatus,
  setSupplierStatusLoading,
  setSupplierStatusSuccess,
  setSupplierStatusError,
  setSupplierArticle,
} = supplierSlice.actions;

export default supplierSlice.reducer;
