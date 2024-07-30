import {
  Autocomplete,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useState, useMemo } from 'react';

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFastSearch = async (searchQuery) => {
    console.log('handleFastSearch');
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);

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
      console.log('Fast search failed: ' + error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => handleFastSearch(searchQuery), 1200),
    []
  );

  const handleInputChange = (e, value, reason) => {
    if (reason === 'input') {
      setInputValue(value);
      if (value === '') {
        setResults([]);
      } else {
        debouncedSearch(value);
      }
    }
    console.log('handleInputChange', e, reason);
  };

  const handleItemClick = (_e, value) => {
    if (value) {
      console.log(
        `Selected item: ${value.brand} - ${value.number} - ${value.descr}`
      );
      setInputValue('');
      setResults([]);
      setOpen(false);
    }
  };

  const handleOnClose = () => {
    console.log('handleOnClose');
    setOpen(false);
    setResults([]);
  };

  const handleBlur = () => {
    console.log('handleBlur');
    setInputValue('');
    setResults([]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <h2>Search</h2>
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleOnClose}
        inputValue={inputValue}
        options={results}
        getOptionLabel={(option) =>
          `${option.brand} - ${option.number} - ${option.descr}`
        }
        onInputChange={handleInputChange}
        onChange={handleItemClick}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.id}
            onClick={(event) => {
              props.onClick(event);
              handleItemClick(event, option);
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
            onBlur={handleBlur}
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
    </Container>
  );
};
