import { ActionBar } from '@components/ActionBar/ActionBar';
import { SocketContext } from '@context/SocketContext';
import { useAutocomplete } from '@hooks/useAutocomplete';
import { useAutoFocusClarification } from '@hooks/useAutoFocusClarification';
import { useFilteredPipeline } from '@hooks/useFilteredPipeline';
import { useNormalizedOptions } from '@hooks/useNormalizedOptions';
import { useOptionSelection } from '@hooks/useOptionSelection';
import { useSearchHandlers } from '@hooks/useSearchHandlers';
import { useSearchHistory } from '@hooks/useSearchHistory';
import { useSocketManager } from '@hooks/useSocketManager';
import { useSupplierSelection } from '@hooks/useSupplierSelection';
import { Container, Grid } from '@mui/material';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBrandClarifications } from 'src/redux/brandClarificationSlice';
import { SearchAutocompleteUI } from './SearchAutocompleteUI';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  useSocketManager(socket);

  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);
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

  const [maxDeadline, setMaxDeadline] = useState('');
  const [maxDeliveryDate, setMaxDeliveryDate] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');

  const filteredBrands = useMemo(() => {
    if (!isClarifying || !brandClarifications?.length) return [];

    const lowerInput = inputValue.toLowerCase();
    return brandClarifications.filter((option) =>
      option.brand?.toLowerCase().includes(lowerInput)
    );
  }, [isClarifying, brandClarifications, inputValue]);

  const combinedOptions = useMemo(() => {
    if (isClarifying) return filteredBrands;
    return autocompleteResults;
  }, [isClarifying, filteredBrands, autocompleteResults]);

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

  const finalFilteredData = useFilteredPipeline(
    supplierStatus,
    selectedSuppliers,
    { maxDeadline, maxDeliveryDate, maxPrice, minQuantity }
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && isClarifying && inputValue === '') {
      handleCancelClarification(e);
    }
  };

  const onOptionChange = (event, newValue) => {
    handleOptionSelectionWithHistory(event, newValue);

    if (newValue) {
      handleInputChange(event, '', 'input');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchAutocompleteUI
            inputValue={inputValue}
            displayOptions={displayOptions}
            onInputChange={handleInputChange}
            onChange={onOptionChange}
            onKeyDown={handleKeyDown}
            getOptionLabel={getOptionLabelText}
            getOptionKey={getOptionKey}
            isClarifying={isClarifying}
            clarifyingArticle={clarifyingArticle}
            onCancelClarification={handleCancelClarification}
            inputRef={inputRef}
            isAutocompleteLoading={isAutocompleteLoading}
            onClearInput={handleClearInput}
            showClearHistory={showClearHistory}
            onClearHistory={clearHistory}
            isLoading={isLoading}
            onBrandClarify={() => handleBrandClarification(inputValue)}
          />
        </Grid>

        <Grid item xs={12}>
          <ActionBar
            supplierStatus={supplierStatus}
            maxDeadline={maxDeadline}
            setMaxDeadline={setMaxDeadline}
            maxDeliveryDate={maxDeliveryDate}
            setMaxDeliveryDate={setMaxDeliveryDate}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minQuantity={minQuantity}
            setMinQuantity={setMinQuantity}
          />
        </Grid>

        <Grid item xs={12}>
          <MemoizedResultsTable data={finalFilteredData} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchComponent;
