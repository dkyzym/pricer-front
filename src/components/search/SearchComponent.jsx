import { socket } from '@api/ws/socket';
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

import { BrandClarificationTable } from './brandClarificationTable/BrandClarificationTable';
import { columns } from './dataGrid/searchResultsTableColumns';

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedSearchResults, setDetailedSearchResults] = useState([]);
  const [brandClarifications, setBrandClarifications] = useState([]);
  const [isClarifying, setIsClarifying] = useState(false);

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
    setLoading(false);
  }, []);

  const handleAutocompleteError = useCallback((error) => {
    toast.error(error.message);
    setAutocompleteResults([]);
    setLoading(false);
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
    console.error(error.message);
    setIsClarifying(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    socket.on('connect', handleSocketConnect);
    socket.on('autocompleteResults', handleAutocompleteResults);
    socket.on('autocompleteError', handleAutocompleteError);
    socket.on('getItemResultsData', handleGetItemResultsData);
    socket.on('brandClarificationResults', handleBrandClarificationResults);
    socket.on('brandClarificationError', handleBrandClarificationError);

    return () => {
      socket.off('connect', handleSocketConnect);
      socket.off('autocompleteResults', handleAutocompleteResults);
      socket.off('autocompleteError', handleAutocompleteError);
      socket.off('getItemResultsData', handleGetItemResultsData);
      socket.off('brandClarificationResults', handleBrandClarificationResults);
      socket.off('brandClarificationError', handleBrandClarificationError);
    };
  }, [
    handleSocketConnect,
    handleAutocompleteResults,
    handleAutocompleteError,
    handleGetItemResultsData,
    handleBrandClarificationResults,
    handleBrandClarificationError,
  ]);

  const handleFastSearch = useCallback((searchQuery) => {
    setLoading(true);
    socket.emit('autocomplete', searchQuery);
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
        debouncedSearch(value);
      }
    },
    [debouncedSearch]
  );

  const handleOptionSelect = useCallback((_event, value) => {
    if (value?.brand.trim().includes('Найти') && !value.description) {
      const { article } = value;

      socket.emit('getBrandClarification', article);
      setLoading(true);
    } else if (value) {
      setDetailedSearchResults([]);
      setLoading(true);
      socket.emit('getItemResults', value);
    }
  }, []);

  const handleBrandSelect = useCallback((selectedItem) => {
    socket.emit('getItemResults', selectedItem);
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
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>

      {!loading && detailedSearchResults.length > 0 && (
        <div style={{ height: '80', width: '100%', marginTop: '20px' }}>
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
