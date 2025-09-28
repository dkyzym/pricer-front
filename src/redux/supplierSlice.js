import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supplierStatus: {
    profit: { loading: false, results: [], error: null },
    ug: { loading: false, results: [], error: null },
    ug_f: { loading: false, results: [], error: null },
    ug_bn: { loading: false, results: [], error: null },
    patriot: { loading: false, results: [], error: null },
    autosputnik: { loading: false, results: [], error: null },
    autosputnik_bn: { loading: false, results: [], error: null },
    autoImpulse: { loading: false, results: [], error: null },
    armtek: { loading: false, results: [], error: null },
    npn: { loading: false, results: [], error: null },
    mikano: { loading: false, results: [], error: null },
    avtodinamika: { loading: false, results: [], error: null },
  },
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSupplierStatus(state, action) {
      state.supplierStatus = action.payload;
    },
    resetSupplierStatus(state) {
      Object.keys(state.supplierStatus).forEach((supplierKey) => {
        state.supplierStatus[supplierKey] = {
          ...state.supplierStatus[supplierKey],
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

      if (!supplier) {
        console.error('Supplier is undefined in setSupplierStatusSuccess');
        return;
      }

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
