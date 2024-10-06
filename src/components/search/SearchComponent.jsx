import { socket, SOCKET_EVENTS } from '@api/ws/socket';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { SupplierStatusIndicator } from '@components/StatusIndicator';
import { useSocket } from '@hooks/useSocket';
import { BrandClarificationTable } from './brandClarificationTable/BrandClarificationTable';
import { columns } from './dataGrid/searchResultsTableColumns';

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

  useSocket(socket, {
    [SOCKET_EVENTS.CONNECT]: handleSocketConnect,
    [SOCKET_EVENTS.AUTOCOMPLETE_RESULTS]: handleAutocompleteResults,
    [SOCKET_EVENTS.AUTOCOMPLETE_ERROR]: handleAutocompleteError,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED]: handleSupplierDataFetchStarted,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS]: handleSupplierDataFetchSuccess,
    [SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR]: handleSupplierDataFetchError,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS]:
      handleBrandClarificationResults,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR]: handleBrandClarificationError,
  });

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

  const handleOptionSelect = useCallback((_event, value) => {
    if (value) {
      if (value.brand.trim().includes('Найти') && !value.description) {
        handleBrandClarification(value);
      } else {
        handleDetailedSearch(value);
      }
    }
  }, []);

  const handleBrandClarification = (value) => {
    const { article } = value;
    socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, article);
  };

  const handleDetailedSearch = (value) => {
    socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, value);
  };

  const handleBrandSelect = useCallback((selectedItem) => {
    socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, selectedItem);
    setBrandClarifications([]);
    setIsClarifying(false);
  }, []);

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <h2>Search</h2>
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
              label="Enter search term"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                autoComplete: 'off',
                endAdornment: (
                  <InputAdornment position="end">
                    {isAutocompleteLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>

      {allResults.length > 0 && (
        <div>
          <Box sx={{ display: 'flex', mt: 2, gap: 3 }}>
            {Object.entries(supplierStatus).map(([supplier, status]) => (
              <SupplierStatusIndicator
                key={supplier}
                supplier={supplier}
                status={status}
              />
            ))}
          </Box>

          {allResults.length > 0 && (
            <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
              <DataGrid
                rows={allResults}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      )}

      {isClarifying && brandClarifications.length > 0 && (
        <BrandClarificationTable
          items={brandClarifications}
          onSelect={handleBrandSelect}
        />
      )}
    </Container>
  );
};
