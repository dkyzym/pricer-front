import { API_URL } from '@api/config';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAutocomplete,
  setAutocompleteLoading,
  setAutocompleteResults,
  setInputValue,
} from '../redux/autocompleteSlice';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';

export const useAutocomplete = ({ inputRef }) => {
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
          const response = await axios.get(`${API_URL}/api/autocomplete/ug`, {
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

  useEffect(() => {
    // Эта функция будет вызвана, когда компонент, использующий хук, будет удален
    return () => {
      // 1. Отменяем любой ожидающий выполнения debounced-запрос.
      // Это предотвратит обновление состояния ПОСЛЕ того, как пользователь ушел со страницы.
      debouncedFetchAutocomplete.cancel();

      // 2. Очищаем состояние в Redux, чтобы при следующем монтировании
      // компонент не показывал устаревшие данные.
      dispatch(clearAutocomplete());
      dispatch(clearBrandClarifications());
    };
  }, [dispatch, debouncedFetchAutocomplete]); // Зависимости эффекта

  const handleInputChange = (_event, newValue, reason) => {
    if (reason === 'input') {
      dispatch(setInputValue(newValue));
      if (newValue.trim() === '' || newValue.trim().length < 3) {
        dispatch(setAutocompleteResults([]));
        dispatch(setAutocompleteLoading(false));
        // Отменяем предыдущий запрос, если пользователь быстро стирает текст
        debouncedFetchAutocomplete.cancel();
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
