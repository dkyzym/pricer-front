import { createSlice } from '@reduxjs/toolkit';

const initialSupplierStatus = {
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
  avtoPartner: { loading: false, results: [], error: null },
};

const SUPPLIERS_STORAGE_KEY = 'pricer_selected_suppliers';

// Функция для получения сохраненных поставщиков или дефолтного значения (ничего не выбрано)
const getSavedSuppliers = () => {
  try {
    const saved = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error('Ошибка чтения из localStorage', e);
  }
  // Если в хранилище пусто, по умолчанию ничего не выбрано
  return [];
};

const initialState = {
  supplierStatus: initialSupplierStatus,
  selectedSuppliers: getSavedSuppliers(),
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
      if (state.supplierStatus[supplier]) {
        state.supplierStatus[supplier] = {
          ...state.supplierStatus[supplier],
          loading: true,
          error: null,
        };
      }
    },
    setSupplierStatusSuccess(state, action) {
      const { supplier, results } = action.payload;
      if (!supplier || !state.supplierStatus[supplier]) {
        console.error(
          'Supplier not found or undefined in setSupplierStatusSuccess'
        );
        return;
      }
      state.supplierStatus[supplier] = {
        ...state.supplierStatus[supplier],
        loading: false,
        results,
        error: null,
      };
    },
    setSupplierStatusError(state, action) {
      const { supplier, error } = action.payload;
      if (state.supplierStatus[supplier]) {
        state.supplierStatus[supplier] = {
          ...state.supplierStatus[supplier],
          loading: false,
          error,
        };
      }
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
    // --- Новые редюсеры для управления выбором ---
    toggleSupplierSelection(state, action) {
      const supplierKey = action.payload;
      const index = state.selectedSuppliers.indexOf(supplierKey);
      if (index !== -1) {
        state.selectedSuppliers.splice(index, 1);
      } else {
        state.selectedSuppliers.push(supplierKey);
      }
      // Сохраняем в localStorage
      localStorage.setItem(
        SUPPLIERS_STORAGE_KEY,
        JSON.stringify(state.selectedSuppliers)
      );
    },
    setAllSuppliersSelected(state) {
      // Выбираем всех, кто есть сейчас в supplierStatus
      state.selectedSuppliers = Object.keys(state.supplierStatus);
      localStorage.setItem(
        SUPPLIERS_STORAGE_KEY,
        JSON.stringify(state.selectedSuppliers)
      );
    },
    clearAllSuppliersSelected(state) {
      state.selectedSuppliers = [];
      localStorage.setItem(
        SUPPLIERS_STORAGE_KEY,
        JSON.stringify(state.selectedSuppliers)
      );
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
  toggleSupplierSelection,
  setAllSuppliersSelected,
  clearAllSuppliersSelected,
} = supplierSlice.actions;

export default supplierSlice.reducer;
