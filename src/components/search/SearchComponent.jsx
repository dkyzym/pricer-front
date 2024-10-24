import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { useContext, useRef } from 'react';

import { SupplierStatusIndicator } from '@components/indicators/SupplierStatusIndicator';
import { SocketContext } from '@context/SocketContext';
import useAutocomplete from '@hooks/useAutocomplete';
import useFilteredResults from '@hooks/useFilteredResults';
import useSearchHandlers from '@hooks/useSearchHandlers';
import useSocketManager from '@hooks/useSocketManager';
import useSupplierSelection from '@hooks/useSupplierSelection';
import useSupplierStatus from '@hooks/useSupplierStatus';
import ClearIcon from '@mui/icons-material/Clear';
import { BrandClarificationTable } from './BrandClarificationTable/BrandClarificationTable';
import { ResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const useSocket = () => {
    return useContext(SocketContext);
  };
  const socket = useSocket();

  const { resetSupplierStatus, setSupplierStatus, supplierStatus } =
    useSupplierStatus();

  const {
    autocompleteResults,
    handleInputChange,
    inputValue,
    isAutocompleteLoading,
    setInputValue,
    setIsAutocompleteLoading,
    setAutocompleteResults,
  } = useAutocomplete(socket);

  const {
    brandClarifications,
    isClarifying,
    setBrandClarifications,
    setIsClarifying,
  } = useSocketManager(socket, {
    setAutocompleteResults,
    setIsAutocompleteLoading,
    setSupplierStatus,
  });

  const inputRef = useRef(null);

  const { selectedSuppliers, handleSupplierChange } =
    useSupplierSelection(supplierStatus);

  const { handleClearInput, handleOptionSelect, handleBrandSelect } =
    useSearchHandlers({
      socket,
      resetSupplierStatus,
      setBrandClarifications,
      setIsClarifying,
      inputRef,
      setInputValue,
      setAutocompleteResults,
      setIsAutocompleteLoading,
    });

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results
  );

  const filteredResults = useFilteredResults(allResults, selectedSuppliers);

  const AutocompleteInput = (params) => (
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
            {isAutocompleteLoading && (
              <CircularProgress color="inherit" size={20} />
            )}
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
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
            renderInput={AutocompleteInput}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 3 }}>
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
        </Grid>
        <Grid item xs={12}>
          <ResultsTable allResults={filteredResults} />
        </Grid>
        {isClarifying && brandClarifications.length > 0 && (
          <Grid item xs={12}>
            <BrandClarificationTable
              items={brandClarifications}
              onSelect={handleBrandSelect}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
