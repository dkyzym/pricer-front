import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

export const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFastSearch = async (searchTerm) => {
    if (!searchTerm) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/search-ug`, {
        params: {
          term: searchTerm,
          locale: 'ru_RU',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setResults(response?.data.data);

        console.log('Search successful');
      } else {
        setResults([]);

        console.log(response.data.message);
      }
    } catch (error) {
      console.log('Fast search failed' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleFastSearch, 1500), []);

  const handleDeepSearch = async () => {
    if (!query) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/search-ug/deep?pcode=${query}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log('Search completed: ' + response.data);
      }
    } catch (error) {
      console.log('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, value, reason) => {
    if (reason !== 'reset') {
      setQuery(value);
      if (value === '') {
        setResults([]);
      } else {
        debouncedSearch(value);
      }
    }
  };

  const handleItemClick = (event, value) => {
    if (!value) return;

    console.log(
      `Selected item: ${value.brand} - ${value.number} - ${value.descr}`
    );
    setQuery('');
    setResults([]);
    setOpen(false);
    console.log(results);
  };

  const handleOnClose = () => {
    setOpen(false);
    setResults([]);
  };

  const handleBlur = () => {
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
        inputValue={query}
        options={results}
        getOptionLabel={(option) =>
          `${option.brand} - ${option.number} - ${option.descr}`
        }
        onInputChange={handleInputChange}
        onChange={handleItemClick}
        renderOption={(props, option) =>
          option?.id && (
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
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter search term"
            variant="outlined"
            onBlur={handleBlur}
            InputProps={{
              ...params.InputProps,
              autoComplete: 'off',
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  <IconButton onClick={handleDeepSearch}>
                    <SearchIcon />
                  </IconButton>
                  {params.InputProps.endAdornment}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Container>
  );
};
