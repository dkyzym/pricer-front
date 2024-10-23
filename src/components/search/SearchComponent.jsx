import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { useRef } from 'react';

import { socket } from '@api/ws/socket';
import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import { SupplierStatusIndicator } from '@components/indicators/StatusIndicator';
import useAutocomplete from '@hooks/useAutocomplete';
import useFilteredResults from '@hooks/useFilteredResults';
import useSearchHandlers from '@hooks/useSearchHandlers';
import { useSocket } from '@hooks/useSocket';
import useSocketManager from '@hooks/useSocketManager';
import useSupplierSelection from '@hooks/useSupplierSelection';
import useSupplierStatus from '@hooks/useSupplierStatus';
import ClearIcon from '@mui/icons-material/Clear';
import { BrandClarificationTable } from './brandClarificationTable/BrandClarificationTable';
import { ResultsTable } from './dataGrid/searchResultsTableColumns';

export const SearchComponent = () => {
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

  const socketStatus = useSocket(socket);

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
