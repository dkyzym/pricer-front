import { useAutocomplete } from '@hooks/useAutocomplete';
import { useAutoFocusClarification } from '@hooks/useAutoFocusClarification';
import { useNormalizedOptions } from '@hooks/useNormalizedOptions';
import { useOptionSelection } from '@hooks/useOptionSelection';
import { useSearchHandlers } from '@hooks/useSearchHandlers';
import { useSearchHistory } from '@hooks/useSearchHistory';
import { useSupplierSelection } from '@hooks/useSupplierSelection';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBrandClarifications } from 'src/redux/brandClarificationSlice';

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
  const { selectedSuppliers } = useSupplierSelection();

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
    selectedSuppliers,
    onStartClarify: () => handleInputChange(null, '', 'input'),
  });

  const { normalizeOptionsWithKeys, getOptionLabelText, getOptionKey } =
    useNormalizedOptions();

  const handleOptionSelectionWithHistory = useOptionSelection({
    clearHistory,
    handleInputChange,
    addToHistory,
    handleOptionSelect,
  });

  useAutoFocusClarification(isClarifying, brandClarifications, inputRef);

  const filteredBrands = useMemo(() => {
    if (!isClarifying || !brandClarifications?.length) return [];
    const lowerInput = inputValue.toLowerCase();
    return brandClarifications.filter((option) =>
      option.brand?.toLowerCase().includes(lowerInput)
    );
  }, [isClarifying, brandClarifications, inputValue]);

  const combinedOptions = useMemo(
    () => (isClarifying ? filteredBrands : autocompleteResults),
    [isClarifying, filteredBrands, autocompleteResults]
  );

  const displayOptions = useMemo(() => {
    if (inputValue.trim() !== '' || isClarifying) {
      const groupName = isClarifying ? 'Уточнение бренда' : 'Результаты поиска';
      return normalizeOptionsWithKeys(combinedOptions, groupName);
    }
    if (history.length > 0) {
      return normalizeOptionsWithKeys(history, 'История поиска');
    }
    return [];
  }, [inputValue, combinedOptions, history, isClarifying, normalizeOptionsWithKeys]);

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
