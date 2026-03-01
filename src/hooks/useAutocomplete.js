import { API_URL } from '@api/config';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAutocomplete,
  setAutocompleteLoading,
  setAutocompleteResults,
} from '../redux/autocompleteSlice';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';

/**
 * Опция автокомплита / уточнения бренда (API или Redux).
 * @typedef {Object} AutocompleteOption
 * @property {string} [id] — уникальный идентификатор
 * @property {string} [key] — ключ для React
 * @property {string} [brand] — бренд
 * @property {string} [number] — артикул/номер
 * @property {string} [descr] — описание
 */

/**
 * @typedef {Object} UseAutocompleteParams
 * @property {React.RefObject<HTMLInputElement|null>} inputRef — ref поля ввода (для focus при clear)
 * @property {boolean} isClarifying — режим уточнения бренда; при true fetch не вызывается
 */

/**
 * @typedef {Object} UseAutocompleteReturn
 * @property {string} inputValue — текущее значение поля
 * @property {function(React.SyntheticEvent, string, string): void} handleInputChange — обработчик change (event, newValue, reason)
 * @property {AutocompleteOption[]} autocompleteResults — результаты из Redux
 * @property {boolean} isAutocompleteLoading — загрузка
 * @property {function(): void} handleClearInput — очистка и focus
 */

/**
 * Локальный стейт ввода + debounced fetch автокомплита (UG API).
 * При isClarifying запросы не выполняются — ввод используется только для фильтрации брендов.
 *
 * @param {UseAutocompleteParams} params
 * @returns {UseAutocompleteReturn}
 */
export const useAutocomplete = ({ inputRef, isClarifying }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const autocompleteResults = useSelector(
    (state) => state.autocomplete.results
  );
  const isAutocompleteLoading = useSelector(
    (state) => state.autocomplete.loading
  );

  /** useMemo + debounce: стабильная ссылка для useEffect cleanup (cancel) и зависимостей. */
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
    return () => {
      debouncedFetchAutocomplete.cancel();
      dispatch(clearAutocomplete());
      dispatch(clearBrandClarifications());
    };
  }, [dispatch, debouncedFetchAutocomplete]);

  const handleInputChange = (_event, newValue, reason) => {
    if (reason === 'input') {
      setInputValue(newValue.trimStart());

      if (isClarifying) {
        return;
      }

      if (newValue.trim() === '' || newValue.trim().length < 3) {
        dispatch(setAutocompleteResults([]));
        dispatch(setAutocompleteLoading(false));
        debouncedFetchAutocomplete.cancel();
        return;
      }
      dispatch(setAutocompleteLoading(true));
      debouncedFetchAutocomplete(newValue.trim());
    } else if (reason === 'clear') {
      setInputValue('');
      dispatch(clearAutocomplete());
      dispatch(clearBrandClarifications());
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearInput = () => {
    setInputValue('');
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
