import axios from 'axios';
import debounce from 'lodash/debounce';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAutocompleteLoading,
  setAutocompleteResults,
  setInputValue,
} from '../redux/autocompleteSlice';

const useAutocomplete = () => {
  const dispatch = useDispatch();
  const inputValue = useSelector((state) => state.autocomplete.inputValue);
  const autocompleteResults = useSelector(
    (state) => state.autocomplete.results
  );
  const isAutocompleteLoading = useSelector(
    (state) => state.autocomplete.loading
  );

  const debouncedFetchAutocomplete = useMemo(
    () =>
      debounce(async (term) => {
        if (term.length < 3) {
          dispatch(setAutocompleteResults([]));
          dispatch(setAutocompleteLoading(false));
          return;
        }

        try {
          const response = await axios.get(
            'http://localhost:3000/api/autocomplete/ug',
            {
              params: { term },
            }
          );
          dispatch(setAutocompleteResults(response.data.results || []));
        } catch (error) {
          console.error('Autocomplete error:', error);
          dispatch(setAutocompleteResults([]));
        } finally {
          dispatch(setAutocompleteLoading(false));
        }
      }, 300),
    [dispatch]
  );

  const handleInputChange = (_event, newValue, reason) => {
    if (reason === 'input') {
      dispatch(setInputValue(newValue));

      if (newValue.trim() === '') {
        dispatch(setAutocompleteResults([]));
        dispatch(setAutocompleteLoading(false));
        return;
      }

      if (newValue.trim().length < 3) {
        dispatch(setAutocompleteResults([]));
        dispatch(setAutocompleteLoading(false));
        return;
      }

      dispatch(setAutocompleteLoading(true));
      debouncedFetchAutocomplete(newValue.trim());
    }

    if (reason === 'reset') {
      dispatch(setInputValue(''));
      dispatch(setAutocompleteResults([]));
      dispatch(setAutocompleteLoading(false));
    }
  };

  const handleClearInput = () => {
    dispatch(setInputValue(''));
    dispatch(setAutocompleteResults([]));
    dispatch(setAutocompleteLoading(false));
  };

  return {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    handleClearInput,
  };
};

export default useAutocomplete;
