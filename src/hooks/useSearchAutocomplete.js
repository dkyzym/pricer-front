import { useAutocomplete } from '@hooks/useAutocomplete';
import { useAutoFocusClarification } from '@hooks/useAutoFocusClarification';
import { useNormalizedOptions } from '@hooks/useNormalizedOptions';
import { useOptionSelection } from '@hooks/useOptionSelection';
import { useSearchHandlers } from '@hooks/useSearchHandlers';
import { useSearchHistory } from '@hooks/useSearchHistory';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBrandClarifications } from 'src/redux/brandClarificationSlice';
import { buildDisplayOptions } from 'src/utils/buildDisplayOptions';

/**
 * Опция для отображения в Autocomplete (автокомплит, уточнение бренда или история).
 * @typedef {Object} DisplayOption
 * @property {string} [id]
 * @property {string} [key]
 * @property {string} [brand]
 * @property {string} [number]
 * @property {string} [descr]
 * @property {string} [group] — группа: «Результаты поиска», «Уточнение бренда», «История поиска»
 */

/**
 * @typedef {Object} UseSearchAutocompleteReturn
 * @property {string} inputValue
 * @property {DisplayOption[]} displayOptions — опции для Autocomplete (buildDisplayOptions)
 * @property {function(React.SyntheticEvent, string): void} onInputChange
 * @property {function(React.SyntheticEvent, DisplayOption|null): void} onChange — выбор опции
 * @property {function(KeyboardEvent): void} onKeyDown — Backspace при пустом вводе в режиме уточнения → отмена
 * @property {function(DisplayOption): string} getOptionLabel
 * @property {function(DisplayOption): string} getOptionKey
 * @property {boolean} isClarifying
 * @property {string} [clarifyingArticle] — артикул, по которому уточняем бренд
 * @property {function(React.SyntheticEvent): void} onCancelClarification
 * @property {React.RefObject<HTMLInputElement|null>} inputRef
 * @property {boolean} isAutocompleteLoading
 * @property {function(): void} onClearInput
 * @property {boolean} showClearHistory — показывать ли кнопку «Очистить историю»
 * @property {function(): void} onClearHistory
 * @property {boolean} isLoading — загрузка уточнения бренда
 * @property {function(): void} onBrandClarify
 */

/**
 * Композиция хуков поиска: автокомплит, уточнение бренда, история, выбор поставщиков.
 * Возвращает полный API для SearchAutocompleteUI.
 *
 * @param {import('socket.io-client').Socket | null} socket — для отправки запросов к поставщикам
 * @returns {UseSearchAutocompleteReturn}
 */
export const useSearchAutocomplete = (socket) => {
  const dispatch = useDispatch();

  const brandClarifications = useSelector(
    (state) => state.brandClarification.brands
  );
  const isClarifying = useSelector(
    (state) => state.brandClarification.isClarifying
  );
  const isLoading = useSelector((state) => state.brandClarification.isLoading);
  const clarifyingArticle = useSelector(
    (state) => state.brandClarification.clarifyingArticle
  );

  const inputRef = useRef(null);

  const {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    handleClearInput,
  } = useAutocomplete({ inputRef, isClarifying });

  const { history, addToHistory, clearHistory } = useSearchHistory();

  const handleCancelClarification = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      dispatch(clearBrandClarifications());
      handleInputChange(null, clarifyingArticle, 'input');
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [dispatch, clarifyingArticle, handleInputChange]
  );

  const { handleOptionSelect, handleBrandClarification } = useSearchHandlers({
    socket,
    onStartClarify: () => handleInputChange(null, '', 'input'),
  });

  const { getOptionLabelText, getOptionKey } = useNormalizedOptions();

  const handleOptionSelectionWithHistory = useOptionSelection({
    clearHistory,
    handleInputChange,
    addToHistory,
    handleOptionSelect,
  });

  useAutoFocusClarification(isClarifying, brandClarifications, inputRef);

  const displayOptions = useMemo(
    () =>
      buildDisplayOptions({
        isClarifying,
        brandClarifications,
        inputValue,
        autocompleteResults,
        history,
      }),
    [isClarifying, brandClarifications, inputValue, autocompleteResults, history]
  );

  const showClearHistory =
    history.length > 0 && inputValue.trim() === '' && !isClarifying;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace' && isClarifying && inputValue === '') {
        handleCancelClarification(e);
      }
    },
    [isClarifying, inputValue, handleCancelClarification]
  );

  const onOptionChange = useCallback(
    (event, newValue) => {
      handleOptionSelectionWithHistory(event, newValue);
      if (newValue) {
        handleInputChange(event, '', 'input');
      }
    },
    [handleOptionSelectionWithHistory, handleInputChange]
  );

  const onBrandClarify = useCallback(
    () => handleBrandClarification(inputValue),
    [handleBrandClarification, inputValue]
  );

  return {
    inputValue,
    displayOptions,
    onInputChange: handleInputChange,
    onChange: onOptionChange,
    onKeyDown: handleKeyDown,
    getOptionLabel: getOptionLabelText,
    getOptionKey,
    isClarifying,
    clarifyingArticle,
    onCancelClarification: handleCancelClarification,
    inputRef,
    isAutocompleteLoading,
    onClearInput: handleClearInput,
    showClearHistory,
    onClearHistory: clearHistory,
    isLoading,
    onBrandClarify,
  };
};
