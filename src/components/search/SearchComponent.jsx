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

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedSearchResults, setDetailedSearchResults] = useState([]);

  useEffect(() => console.log(detailedSearchResults), [detailedSearchResults]);

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');
    setInputValue('');
    setAutocompleteResults([]);
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
    console.log('Item Results:', result);
    setDetailedSearchResults((prevResults) => [
      ...prevResults,
      ...(result?.data || []),
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    socket.on('connect', handleSocketConnect);
    socket.on('autocompleteResults', handleAutocompleteResults);
    socket.on('autocompleteError', handleAutocompleteError);
    socket.on('getItemResultsData', handleGetItemResultsData);

    return () => {
      socket.off('connect', handleSocketConnect);
      socket.off('autocompleteResults', handleAutocompleteResults);
      socket.off('autocompleteError', handleAutocompleteError);
      socket.off('getItemResultsData', handleGetItemResultsData);
    };
  }, [
    handleSocketConnect,
    handleAutocompleteResults,
    handleAutocompleteError,
    handleGetItemResultsData,
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
    if (value) {
      setDetailedSearchResults([]);
      setLoading(true);
      socket.emit('getItemResults', value);
    }
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.article}
          style={{ width: '50px', height: '50px' }}
        />
      ),
    },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { field: 'article', headerName: 'Article', width: 120 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'availability', headerName: 'Availability', width: 130 },
    { field: 'warehouse', headerName: 'Warehouse', width: 130 },
    { field: 'probability', headerName: 'Probability', width: 130 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'deadline', headerName: 'Deadline (min)', width: 150 },
    { field: 'supplier', headerName: 'Supplier', width: 150 },
  ];

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
    </Container>
  );
};
