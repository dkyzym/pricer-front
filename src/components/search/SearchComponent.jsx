import { socket, SOCKET_EVENTS } from '@api/ws/socket';
import {
  Autocomplete,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useSocket } from '@hooks/useSocket';
import { BrandClarificationTable } from './brandClarificationTable/BrandClarificationTable';
import { columns } from './dataGrid/searchResultsTableColumns';

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedSearchResults, setDetailedSearchResults] = useState([]);
  const [brandClarifications, setBrandClarifications] = useState([]);
  const [isClarifying, setIsClarifying] = useState(false);
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');
    setInputValue('');
    setAutocompleteResults([]);
    setBrandClarifications([]);
    setIsClarifying(false);
    setLoading(false);
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

  const handleGetItemResultsData = useCallback(({ result }) => {
    setDetailedSearchResults((prevResults) => [
      ...prevResults,
      ...(result?.data || []),
    ]);
    setLoading(false);
  }, []);

  const handleBrandClarificationResults = useCallback((data) => {
    setBrandClarifications(data.brands);
    setIsClarifying(true);
    setLoading(false);
  }, []);

  const handleBrandClarificationError = useCallback((error) => {
    toast.error(error.message);
    setIsClarifying(false);
    setLoading(false);
  }, []);

  useSocket(socket, {
    [SOCKET_EVENTS.CONNECT]: handleSocketConnect,
    [SOCKET_EVENTS.AUTOCOMPLETE_RESULTS]: handleAutocompleteResults,
    [SOCKET_EVENTS.AUTOCOMPLETE_ERROR]: handleAutocompleteError,
    [SOCKET_EVENTS.GET_ITEM_RESULTS_DATA]: handleGetItemResultsData,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS]:
      handleBrandClarificationResults,
    [SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR]: handleBrandClarificationError,
  });

  const handleFastSearch = useCallback((searchQuery) => {
    setIsAutocompleteLoading(true);
    socket.emit(SOCKET_EVENTS.AUTOCOMPLETE, searchQuery);
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      handleFastSearch(searchQuery);
    }, 300),
    [handleFastSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback(
    (_e, value, reason) => {
      if (reason === 'input') {
        setInputValue(value);
        setIsAutocompleteLoading(true);
        debouncedSearch(value);
      }
    },
    [debouncedSearch]
  );

  const handleOptionSelect = useCallback((_event, value) => {
    if (value) {
      setDetailedSearchResults([]);
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
    setLoading(true);
  };

  const handleDetailedSearch = (value) => {
    setLoading(true);
    socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, value);
  };

  const handleBrandSelect = useCallback((selectedItem) => {
    socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, selectedItem);
    setBrandClarifications([]);
    setIsClarifying(false);
  }, []);

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
                    {loading || isAutocompleteLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>

      {detailedSearchResults.length > 0 && (
        <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
          <DataGrid
            rows={detailedSearchResults}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            aria-hidden="true"
          />
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
