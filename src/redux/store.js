import { configureStore } from '@reduxjs/toolkit';
import autocompleteReducer from './autocompleteSlice';
import brandClarificationReducer from './brandClarificationSlice';
import sessionReducer from './sessionSlice';
import supplierReducer from './supplierSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    autocomplete: autocompleteReducer,
    supplier: supplierReducer,
    brandClarification: brandClarificationReducer,
  },
});

export default store;
