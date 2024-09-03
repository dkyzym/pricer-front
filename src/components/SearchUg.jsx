import { handleSearchBtnClick } from '@api/api';
import { socket } from '@api/ws/socket';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
} from '@mui/material';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

const ZebraListItem = styled(ListItem)(({ theme, 'data-own': own }) => ({
  backgroundColor:
    own === 'true'
      ? theme.palette.primary.light
      : theme.palette.background.paper,
  '&:nth-of-type(odd)': {
    backgroundColor:
      own === 'true' ? theme.palette.success.light : theme.palette.action.hover,
  },
}));

export const SearchComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deepSearchResults, setDeepSearchResults] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setInputValue('');
      setResults([]);
      setLoading(false);
    });

    socket.on('autocompleteResults', ({ results }) => {
      console.log('autocompleteResults', results);
      setResults(results?.data || []);
      setLoading(false);
    });

    socket.on('autocompleteError', (error) => {
      console.error('Autocomplete error:', error);
      setResults([]);
      setLoading(false);
    });

    socket.on('getItemResultsData', ({ ugSearchResult }) => {
      console.log('Item Results:', ugSearchResult);
      setDeepSearchResults(ugSearchResult?.data || []);
      setLoading(false);
    });

    socket.on('startLoading', () => {
      setLoading(true);
    });

    return () => {
      socket.off('autocompleteResults');
      socket.off('autocompleteError');
      socket.off('connect');
      socket.off('getItemResultsData');
      socket.off('startLoading');
    };
  }, []);

  const handleFastSearch = (searchQuery) => {
    socket.emit('autocomplete', searchQuery);
  };

  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => handleFastSearch(searchQuery), 300),
    []
  );

  const handleInputChange = (_e, value, reason) => {
    if (reason === 'input') {
      setInputValue(value);
      debouncedSearch(value);
    }
  };

  const handleOptionSelect = (_event, value) => {
    if (value) {
      socket.emit('getItemResults', value);
      setLoading(false);
    }
  };

  const handleDeepSearch = async (inputValue) => {
    try {
      const data = await handleSearchBtnClick(inputValue);
      console.log('Response Data:', data);
      setDeepSearchResults(data || []);
    } catch (error) {
      console.error('Error during deep search:', error);
      setDeepSearchResults([]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <h2>Search</h2>
      <Stack direction="row" spacing={1}>
        <Autocomplete
          sx={{ width: '100%' }}
          freeSolo
          inputValue={inputValue}
          options={results}
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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDeepSearch(inputValue)}
          disabled={loading}
        >
          <SearchOutlinedIcon fontSize="large" />
        </Button>
      </Stack>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {!loading && deepSearchResults.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Article</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Probability</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deepSearchResults.map((product, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#fff',
                  }}
                >
                  <TableCell>
                    <img
                      src={product?.imageUrl}
                      alt={product?.article}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </TableCell>
                  <TableCell>{product?.brand}</TableCell>
                  <TableCell>{product?.article}</TableCell>
                  <TableCell>{product?.description}</TableCell>
                  <TableCell>{product?.availability}</TableCell>
                  <TableCell>{product?.warehouse}</TableCell>
                  <TableCell>{product?.probability}</TableCell>
                  <TableCell>{product?.price} ₽</TableCell>
                  <TableCell>{product?.deadline} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Список результатов (возвращаемый функционал) */}
      <List sx={{ mt: 3 }}>
        {deepSearchResults.length > 0 &&
          deepSearchResults.map(({ own, article, brand }, index) => (
            <ZebraListItem key={index} data-own={own?.toString()}>
              <Stack role="li" direction={'row'} gap={2}>
                <ListItemText primary={`${article?.toUpperCase()} `} />
                <ListItemText primary={`${brand?.toUpperCase()}`} />
              </Stack>
            </ZebraListItem>
          ))}
      </List>
    </Container>
  );
};
