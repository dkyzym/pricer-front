import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeepSearch = async () => {
    if (!inputValue) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      const response = await axios.get(
        `http://localhost:3000/search-ug/deep?pcode=${inputValue}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log('Search completed: ' + response.data);
      }
    } catch (error) {
      console.log('Search failed: ' + error.message);
      setError(true);
      setErrorMessage('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFastSearch = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      const response = await axios.get(`http://localhost:3000/search-ug`, {
        params: {
          term: searchQuery,
          locale: 'ru_RU',
        },
        withCredentials: true,
      });

      setResults(response.data.success ? response.data.data : []);
      console.log(
        response.data.success ? 'Search successful' : response.data.message
      );
    } catch (error) {
      console.log('Fast search failed: ', error.message);
      setError(true);
      setErrorMessage('Fast search failed: ' + error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => handleFastSearch(searchQuery), 1200),
    []
  );

  const handleOnClose = () => {
    setOpen(false);
    setResults([]);
  };

  const handleInputChange = (_e, value, reason) => {
    if (reason === 'clear') {
      handleOnClose();
      setInputValue('');
      return;
    }

    if (reason === 'reset') {
      setInputValue('');
      return;
    }

    if (reason === 'input') {
      setInputValue(value);
      if (value === '') {
        setResults([]);
      } else {
        debouncedSearch(value);
      }
      return;
    }
  };

  const handleItemClick = (_e, value) => {
    if (value) {
      console.log(
        `Selected item: ${value.brand} - ${value.number} - ${value.descr}`
      );
      handleOnClose();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <h2>Search</h2>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={{ width: '100%' }}
          freeSolo
          open={open}
          onOpen={() => setOpen(true)}
          onClose={handleOnClose}
          inputValue={inputValue}
          options={results}
          filterOptions={(x) => x}
          getOptionLabel={(option) =>
            `${option.brand} - ${option.number} - ${option.descr}`
          }
          onInputChange={handleInputChange}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.id}
              onClick={(e) => {
                props.onClick(e);
                handleItemClick(e, option);
              }}
            >
              {option.brand} - {option.number} - {option.descr}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter search term"
              variant="outlined"
              error={error}
              helperText={error ? errorMessage : ''}
              slotProps={{
                input: {
                  ...params.InputProps,
                  autoComplete: 'off',
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDeepSearch}
          disabled={loading}
        >
          <SearchIcon />
        </Button>
      </Stack>
    </Container>
  );
};
