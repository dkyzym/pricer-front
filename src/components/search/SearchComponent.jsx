import { socket, SOCKET_EVENTS } from '@api/ws/socket';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import { SupplierStatusIndicator } from '@components/indicators/StatusIndicator';
import { useSocket } from '@hooks/useSocket';
import ClearIcon from '@mui/icons-material/Clear';
import { BrandClarificationTable } from './brandClarificationTable/BrandClarificationTable';
import { ResultsTable } from './dataGrid/searchResultsTableColumns';

export const SearchComponent = () => {
  const initialSupplierState = {
    profit: { loading: false, results: [], error: null },
    turboCars: { loading: false, results: [], error: null },
    ug: { loading: false, results: [], error: null },
    patriot: { loading: false, results: [], error: null },
  };

  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [brandClarifications, setBrandClarifications] = useState([]);
  const [isClarifying, setIsClarifying] = useState(false);
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
  const [supplierStatus, setSupplierStatus] = useState(initialSupplierState);
  const inputRef = useRef(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState(() =>
    Object.keys(supplierStatus)
  );

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');

    setAutocompleteResults([]);
    setBrandClarifications([]);
    setIsClarifying(false);
  }, []);

  const handleAutocompleteResults = useCallback(({ results }) => {
    setAutocompleteResults(results?.data || []);
    setIsAutocompleteLoading(false);
  }, []);

  const handleAutocompleteError = useCallback((error) => {
    toast.error(error.message);
    setAutocompleteResults([]);
    setIsAutocompleteLoading(false);
  }, []);

  const handleClearInput = () => {
    setInputValue('');
    setAutocompleteResults([]);
    setIsAutocompleteLoading(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSupplierDataFetchStarted = useCallback(({ supplier }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: { ...prevStatus[supplier], loading: true, error: null },
    }));
  }, []);

  const handleSupplierDataFetchSuccess = useCallback(({ supplier, result }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: {
        ...prevStatus[supplier],
        loading: false,
        results: result?.data || [],
        error: null,
      },
    }));
  }, []);

  const handleSupplierDataFetchError = useCallback(({ supplier, error }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: {
        ...prevStatus[supplier],
        loading: false,
        error,
      },
    }));
  }, []);

  const handleBrandClarificationResults = useCallback((data) => {
    setBrandClarifications(data.brands);
    setIsClarifying(true);
  }, []);

  const handleBrandClarificationError = useCallback((error) => {
    toast.error(error.message);
    setIsClarifying(false);
  }, []);

  const eventHandlers = {
    [SOCKET_EVENTS.CONNECT]: handleSocketConnect,
    [SOCKET_EVENTS.AUTOCOMPLETE_RESULTS]: handleAutocompleteResults,
    [SOCKET_EVENTS.AUTOCOMPLETE_ERROR]: handleAutocompleteError,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED]: handleSupplierDataFetchStarted,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS]: handleSupplierDataFetchSuccess,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR]: handleSupplierDataFetchError,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS]:
      handleBrandClarificationResults,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR]: handleBrandClarificationError,
  };

  const socketStatus = useSocket(socket, eventHandlers);

  const resetSupplierStatus = useCallback(() => {
    setSupplierStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      Object.keys(newStatus).forEach((supplier) => {
        newStatus[supplier] = {
          ...newStatus[supplier],
          results: [],
          loading: false,
          error: null,
        };
      });
      return newStatus;
    });
  }, []);

  const debouncedEmitAutocomplete = useMemo(
    () =>
      debounce((query) => {
        socket.emit(SOCKET_EVENTS.AUTOCOMPLETE, query);
      }, 300),
    [socket]
  );

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
    if (newValue.trim() === '') {
      setAutocompleteResults([]);
      setIsAutocompleteLoading(false);

      return;
    }

    setIsAutocompleteLoading(true);

    debouncedEmitAutocomplete(newValue);
  };

  const handleBrandClarification = (value) => {
    const { article } = value;
    socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, article);
  };

  const handleDetailedSearch = (value) => {
    socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, value);
  };

  const handleOptionSelect = useCallback(
    (_event, value) => {
      if (value) {
        resetSupplierStatus();

        if (value.brand.trim().includes('Найти') && !value.description) {
          handleBrandClarification(value);
        } else {
          handleDetailedSearch(value);
        }
      }
    },
    [handleBrandClarification, handleDetailedSearch, resetSupplierStatus]
  );
  const handleBrandSelect = useCallback(
    (selectedItem) => {
      // Reset supplierStatus results
      resetSupplierStatus();

      socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, selectedItem);
      setBrandClarifications([]);
      setIsClarifying(false);
    },
    [resetSupplierStatus]
  );

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results
  );
  useEffect(() => console.log(allResults), [allResults]);

  const handleSupplierChange = (supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  };

  // Фильтруем данные в соответствии с выбранными поставщиками
  const filteredResults = allResults.filter((item) =>
    selectedSuppliers.includes(item.supplier)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <SocketStatusIndicator socketStatus={socketStatus} />
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={{ width: '100%' }}
          freeSolo
          inputValue={inputValue}
          options={autocompleteResults}
          filterOptions={(x) => x}
          getOptionLabel={(option) =>
            `${option.brand} - ${option.article} - ${option.description}`
          }
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Введите запрос"
              variant="outlined"
              inputRef={inputRef}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'off',
                endAdornment: (
                  <>
                    {isAutocompleteLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {inputValue && (
                      <IconButton
                        onClick={handleClearInput}
                        size="small"
                        sx={{ visibility: inputValue ? 'visible' : 'hidden' }}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
        />
      </Stack>

      <div>
        <Box sx={{ display: 'flex', mt: 2, gap: 3 }}>
          {Object.entries(supplierStatus).map(([supplier, status]) => (
            <SupplierStatusIndicator
              key={supplier}
              supplier={supplier}
              status={status}
              checked={selectedSuppliers.includes(supplier)}
              onChange={handleSupplierChange}
            />
          ))}
        </Box>

        <ResultsTable allResults={filteredResults} />
      </div>

      {isClarifying && brandClarifications.length > 0 && (
        <BrandClarificationTable
          items={brandClarifications}
          onSelect={handleBrandSelect}
        />
      )}
    </Container>
  );
};
