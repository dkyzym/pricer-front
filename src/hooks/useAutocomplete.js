import { BASE_URL } from '@utils/constants';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAutocomplete,
  setAutocompleteLoading,
  setAutocompleteResults,
  setInputValue,
} from '../redux/autocompleteSlice';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';

const useAutocomplete = ({ inputRef }) => {
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
          const response = await axios.get(`${BASE_URL}/api/autocomplete/ug`, {
            params: { term },
          });
          dispatch(clearBrandClarifications());
          dispatch(setAutocompleteResults(response.data.results || []));
        } catch (error) {
          console.error('Autocomplete error:', error);
          dispatch(setAutocompleteResults([]));
        } finally {
          dispatch(setAutocompleteLoading(false));
        }
      }, 200),
    [dispatch]
  );

  const handleInputChange = (_event, newValue, reason) => {
    if (reason === 'input') {
      dispatch(setInputValue(newValue));
      if (newValue.trim() === '' || newValue.trim().length < 3) {
        dispatch(setAutocompleteResults([]));
        dispatch(setAutocompleteLoading(false));
        return;
      }
      dispatch(setAutocompleteLoading(true));
      debouncedFetchAutocomplete(newValue.trim());
    } else if (
      reason === 'clear'
      // || reason === 'reset'
    ) {
      dispatch(clearAutocomplete());
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearInput = () => {
    dispatch(clearAutocomplete());
    dispatch(clearBrandClarifications());
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
