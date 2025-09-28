import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import { SupplierSelectMenu } from '@components/indicators/SupplierSelectMenu';
import { SocketContext } from '@context/SocketContext';
import { useAutocomplete } from '@hooks/useAutocomplete';
import { useAutoFocusClarification } from '@hooks/useAutoFocusClarification';
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
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { dedupeResults } from '@utils/dedupeResults';
import { useContext, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);
  useSocketManager(socket);

  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);
  const brandClarifications = useSelector(
    (state) => state.brandClarification.brands
  );
  const isClarifying = useSelector(
    (state) => state.brandClarification.isClarifying
  );
  const isLoading = useSelector((state) => state.brandClarification.isLoading);

  const inputRef = useRef(null);

  const {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    handleClearInput,
  } = useAutocomplete({ inputRef });

  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { selectedSuppliers, handleSupplierChange } = useSupplierSelection();
  const { handleOptionSelect, handleBrandClarification } = useSearchHandlers({
    socket,
    selectedSuppliers,
  });

  // вынесенные хуки
  const { normalizeOptionsWithKeys, getOptionLabelText, getOptionKey } =
    useNormalizedOptions();
  const handleOptionSelectionWithHistory = useOptionSelection({
    clearHistory,
    handleInputChange,
    addToHistory,
    handleOptionSelect,
  });
  useAutoFocusClarification(isClarifying, brandClarifications, inputRef);

  // выбор источника опций
  const combinedOptions = useMemo(() => {
    if (isClarifying && brandClarifications?.length) {
      return brandClarifications;
    }
    return autocompleteResults;
  }, [isClarifying, brandClarifications, autocompleteResults]);

  // итоговые опции для отображения
  const displayOptions = useMemo(() => {
    if (inputValue.trim() !== '') {
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

  // результаты таблицы
  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results.data || []
  );
  const uniqueResults = useMemo(() => dedupeResults(allResults), [allResults]);
  const filteredResults = useFilteredResults(uniqueResults, selectedSuppliers);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
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
              onChange={handleOptionSelectionWithHistory}
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
              renderInput={(params) => (
                <AutocompleteInput
                  params={params}
                  inputRef={inputRef}
                  isAutocompleteLoading={isAutocompleteLoading}
                  inputValue={inputValue}
                  hasOptions={Boolean(displayOptions.length)}
                  handleClearInput={handleClearInput}
                />
              )}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrandClarification(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Уточнить бренд
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <SupplierSelectMenu
            supplierStatus={supplierStatus}
            selectedSuppliers={selectedSuppliers}
            onSupplierChange={handleSupplierChange}
          />
        </Grid>

        <Grid item xs={12}>
          <MemoizedResultsTable allResults={filteredResults} />
        </Grid>
      </Grid>
    </Container>
  );
};
