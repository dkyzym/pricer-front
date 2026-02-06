import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchOrdersApi } from '../api/ordersApi'; // Проверь путь

const ORDERS_SUPPLIERS_STORAGE_KEY = 'pricer_orders_selected_suppliers';

const loadSavedSuppliers = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ORDERS_SUPPLIERS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read orders suppliers from localStorage', e);
    return [];
  }
};

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    selectedSuppliers: loadSavedSuppliers(),
    searchQuery: '',
    statusFilter: [], // Массив выбранных статусов (например ['refused', 'work'])
  },
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (suppliers, { rejectWithValue }) => {
    try {
      const data = await fetchOrdersApi(suppliers);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Не удалось загрузить заказы';
      return rejectWithValue(message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedSuppliers(state, action) {
      const suppliers = action.payload || [];
      state.filters.selectedSuppliers = suppliers;
      try {
        localStorage.setItem(
          ORDERS_SUPPLIERS_STORAGE_KEY,
          JSON.stringify(suppliers)
        );
      } catch (e) {
        console.error('Failed to persist orders suppliers', e);
      }
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload || '';
    },
    setStatusFilter(state, action) {
      // Экшен принимает массив статусов
      state.filters.statusFilter = action.payload || [];
    },
    resetOrdersState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка загрузки заказов';
      });
  },
});

export const {
  setSelectedSuppliers,
  setSearchQuery,
  setStatusFilter,
  resetOrdersState,
} = ordersSlice.actions;

export default ordersSlice.reducer;
