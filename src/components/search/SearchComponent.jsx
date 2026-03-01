import { ActionBar } from '@components/ActionBar/ActionBar';
import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import { SocketContext } from '@context/SocketContext';
import { useAutocomplete } from '@hooks/useAutocomplete';
import { useAutoFocusClarification } from '@hooks/useAutoFocusClarification';
import { useFilteredData } from '@hooks/useFilteredData';
import { useFilteredResults } from '@hooks/useFilteredResults';
import { useNormalizedOptions } from '@hooks/useNormalizedOptions';
import { useOptionSelection } from '@hooks/useOptionSelection';
import { useSearchHandlers } from '@hooks/useSearchHandlers';
import { useSearchHistory } from '@hooks/useSearchHistory';
import { useSocketManager } from '@hooks/useSocketManager';
import { useSupplierSelection } from '@hooks/useSupplierSelection';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
} from '@mui/material';
import { dedupeResults } from '@utils/dedupeResults';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBrandClarifications } from 'src/redux/brandClarificationSlice';
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

  // Функция отмены режима уточнения
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

  // Двойной поиск: локальная фильтрация по брендам
  const filteredBrands = useMemo(() => {
    if (!isClarifying || !brandClarifications?.length) return [];

    const lowerInput = inputValue.toLowerCase();
    return brandClarifications.filter((option) =>
      option.brand?.toLowerCase().includes(lowerInput)
    );
  }, [isClarifying, brandClarifications, inputValue]);

  const combinedOptions = useMemo(() => {
    if (isClarifying) {
      return filteredBrands;
    }
    return autocompleteResults;
  }, [isClarifying, filteredBrands, autocompleteResults]);

  const displayOptions = useMemo(() => {
    if (inputValue.trim() !== '' || isClarifying) {
      const groupName = isClarifying ? 'Уточнение бренда' : 'Результаты поиска';
      return normalizeOptionsWithKeys(combinedOptions, groupName);
    }

    if (history.length > 0) {
      const historyOptions = normalizeOptionsWithKeys(
        history,
        'История поиска'
      );
      return [
        ...historyOptions,
        {
          brand: 'Очистить историю',
          key: 'clear-history-command',
          isClearCommand: true,
          group: 'История поиска',
        },
      ];
    }

    return [];
  }, [
    inputValue,
    combinedOptions,
    history,
    isClarifying,
    normalizeOptionsWithKeys,
  ]);

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results.data || []
  );
  const uniqueResults = useMemo(() => dedupeResults(allResults), [allResults]);

  const resultsFilteredBySupplier = useFilteredResults(
    uniqueResults,
    selectedSuppliers
  );
  const finalFilteredData = useFilteredData(
    resultsFilteredBySupplier,
    maxDeadline,
    maxDeliveryDate,
    maxPrice,
    minQuantity
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && isClarifying && inputValue === '') {
      handleCancelClarification(e);
    }
  };

  const onOptionChange = (event, newValue) => {
    handleOptionSelectionWithHistory(event, newValue);

    if (newValue && !newValue.isClearCommand) {
      handleInputChange(event, '', 'input');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              sx={{ flexGrow: 1 }}
              freeSolo
              inputValue={inputValue}
              options={displayOptions}
              filterOptions={(x) => x}
              groupBy={(option) => option.group}
              getOptionLabel={getOptionLabelText}
              onInputChange={handleInputChange}
              getOptionKey={getOptionKey}
              onChange={onOptionChange}
              onKeyDown={handleKeyDown}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  key={option.key}
                  sx={
                    option.isClearCommand
                      ? {
                          color: 'error.main',
                          justifyContent: 'center',
                          fontWeight: 'medium',
                        }
                      : {}
                  }
                >
                  {getOptionLabelText(option)}
                </Box>
              )}
              renderInput={(params) => {
                const startAdornment =
                  isClarifying && clarifyingArticle ? (
                    <InputAdornment position="start">
                      <Chip
                        size="small"
                        label={`Артикул: ${clarifyingArticle}`}
                        onDelete={handleCancelClarification}
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, fontWeight: 'medium' }}
                      />
                    </InputAdornment>
                  ) : null;

                const mergedInputProps = {
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {startAdornment}
                      {params.InputProps.startAdornment}
                    </>
                  ),
                };

                return (
                  <AutocompleteInput
                    params={{ ...params, InputProps: mergedInputProps }}
                    inputRef={inputRef}
                    isAutocompleteLoading={isAutocompleteLoading}
                    inputValue={inputValue}
                    hasOptions={Boolean(displayOptions.length)}
                    handleClearInput={handleClearInput}
                    placeholder={
                      isClarifying ? 'Введите бренд...' : 'Введите артикул...'
                    }
                  />
                );
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrandClarification(inputValue)}
              disabled={!inputValue.trim() || isLoading || isClarifying}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Уточнить бренд
            </Button>
          </Box>
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
