import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import { SupplierSelectMenu } from '@components/indicators/SupplierSelectMenu';
import { SocketContext } from '@context/SocketContext';
import useAutocomplete from '@hooks/useAutocomplete';
import useFilteredResults from '@hooks/useFilteredResults';
import useSearchHandlers from '@hooks/useSearchHandlers';
import { useSearchHistory } from '@hooks/useSearchHistory';
import useSocketManager from '@hooks/useSocketManager';
import useSupplierSelection from '@hooks/useSupplierSelection';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { dedupeResults } from '@utils/dedupeResults';
import { simulateClick } from '@utils/simulateClick';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);

  useSocketManager(socket);

  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);

  const inputRef = useRef(null);
  const {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    handleClearInput,
  } = useAutocomplete({ inputRef });

  const { history, addToHistory, clearHistory } = useSearchHistory();

  const brandClarifications = useSelector(
    (state) => state.brandClarification.brands
  );
  const isClarifying = useSelector(
    (state) => state.brandClarification.isClarifying
  );

  const isLoading = useSelector((state) => state.brandClarification.isLoading);

  const { selectedSuppliers, handleSupplierChange } = useSupplierSelection();

  const { handleOptionSelect, handleBrandClarification } = useSearchHandlers({
    socket,
    selectedSuppliers,
  });

  // Универсальная функция для генерации уникальных ключей
  const generateUniqueKey = useCallback((option, index = 0) => {
    if (option.isClearCommand) {
      return 'clear-history-command';
    }

    // Если есть уникальный идентификатор, используем его
    if (option.id) {
      return `option-${option.id}`;
    }

    // Если есть готовый ключ, используем его
    if (option.key) {
      return option.key;
    }

    // Генерируем ключ на основе данных + индекс для уникальности
    const keyParts = [
      option.brand || '',
      option.number || '',
      option.descr || '',
      index.toString(),
    ].filter(Boolean);

    return `generated-${keyParts.join('-')}`;
  }, []);

  // Нормализация опций с гарантированными ключами
  const normalizeOptionsWithKeys = useCallback(
    (options, groupName) => {
      return options.map((option, index) => ({
        ...option,
        group: groupName,
        key: generateUniqueKey(option, index),
      }));
    },
    [generateUniqueKey]
  );

  const handleOptionSelectionWithHistory = useCallback(
    (event, newValue) => {
      if (!newValue) {
        return;
      }

      if (newValue.isClearCommand) {
        clearHistory();
        handleInputChange(event, '', 'clear');
        return;
      }

      if (typeof newValue === 'object' && newValue !== null) {
        // Ключ уже должен быть назначен в normalizeOptionsWithKeys
        addToHistory(newValue);
      }

      handleOptionSelect(event, newValue);
    },
    [clearHistory, handleInputChange, addToHistory, handleOptionSelect]
  );

  const combinedOptions = useMemo(() => {
    if (isClarifying && brandClarifications?.length) {
      return brandClarifications;
    }
    return autocompleteResults;
  }, [isClarifying, brandClarifications, autocompleteResults]);

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

      // Добавляем команду очистки
      const clearCommand = {
        brand: 'Очистить историю',
        key: 'clear-history-command',
        isClearCommand: true,
        group: 'История поиска',
      };

      return [...historyOptions, clearCommand];
    }

    return [];
  }, [
    inputValue,
    combinedOptions,
    history,
    isClarifying,
    normalizeOptionsWithKeys,
  ]);

  useEffect(() => {
    if (isClarifying && brandClarifications.length > 0) {
      setTimeout(() => {
        inputRef.current?.focus();
        simulateClick(inputRef.current);
      }, 0);
    }
  }, [isClarifying, brandClarifications]);

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results.data || []
  );

  const uniqueResults = useMemo(() => dedupeResults(allResults), [allResults]);
  const filteredResults = useFilteredResults(uniqueResults, selectedSuppliers);

  const getOptionLabelText = useCallback((option) => {
    if (typeof option === 'string') return option;
    if (!option || typeof option !== 'object') return '';
    // Для команды очистки возвращаем ее название
    if (option.isClearCommand) return option.brand;
    return `${option.brand} - ${option.number} - ${option.descr}`;
  }, []);

  // Упрощенная функция получения ключа (теперь ключ всегда есть)
  const getOptionKey = useCallback((option) => {
    return option.key;
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              sx={{ flexGrow: 1 }}
              freeSolo
              // openOnFocus
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
          {<MemoizedResultsTable allResults={filteredResults} />}
        </Grid>
      </Grid>
    </Container>
  );
};
