import { configureStore } from '@reduxjs/toolkit';
import autocompleteReducer from './autocompleteSlice';
import brandClarificationReducer from './brandClarificationSlice';
import supplierReducer from './supplierSlice';

export const store = configureStore({
  reducer: {
    autocomplete: autocompleteReducer,
    supplier: supplierReducer,
    brandClarification: brandClarificationReducer,
  },
});

export default store;
