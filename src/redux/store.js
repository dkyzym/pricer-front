import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import autocompleteReducer from './autocompleteSlice';
import brandClarificationReducer from './brandClarificationSlice';
import supplierReducer from './supplierSlice';

export const store = configureStore({
  reducer: {
    autocomplete: autocompleteReducer,
    supplier: supplierReducer,
    brandClarification: brandClarificationReducer,
    auth: authReducer,
  },
});

export default store;
