import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputValue: '',
  results: [],
  loading: false,
  error: null,
};

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState,
  reducers: {
    setInputValue(state, action) {
      state.inputValue = action.payload.trimStart();
    },
    setAutocompleteResults(state, action) {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAutocompleteLoading(state, action) {
      state.loading = action.payload;
    },
    setAutocompleteError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAutocomplete(state) {
      state.inputValue = '';
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setInputValue,
  setAutocompleteResults,
  setAutocompleteLoading,
  setAutocompleteError,
  clearAutocomplete,
} = autocompleteSlice.actions;

export default autocompleteSlice.reducer;
