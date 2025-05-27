import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import { SupplierStatusIndicator } from '@components/indicators/SupplierStatusIndicator';
import { SocketContext } from '@context/SocketContext';
import useAutocomplete from '@hooks/useAutocomplete';
import useFilteredResults from '@hooks/useFilteredResults';
import useSearchHandlers from '@hooks/useSearchHandlers';
import useSocketManager from '@hooks/useSocketManager';
import useSupplierSelection from '@hooks/useSupplierSelection';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { dedupeResults } from '@utils/dedupeResults';
import { simulateClick } from '@utils/simulateClick';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);

  useSocketManager(socket);

  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);

  const inputRef = useRef(null);
  const {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    handleClearInput,
  } = useAutocomplete({ inputRef });

  const brandClarifications = useSelector(
    (state) => state.brandClarification.brands
  );
  const isClarifying = useSelector(
    (state) => state.brandClarification.isClarifying
  );

  const isLoading = useSelector((state) => state.brandClarification.isLoading);

  const { selectedSuppliers, handleSupplierChange } = useSupplierSelection();

  const { handleOptionSelect, handleBrandClarification } = useSearchHandlers({
    socket,
    selectedSuppliers,
  });

  const combinedOptions = useMemo(() => {
    if (isClarifying && brandClarifications?.length) {
      return brandClarifications;
    }
    return autocompleteResults;
  }, [isClarifying, brandClarifications, autocompleteResults]);

  useEffect(() => {
    if (isClarifying && brandClarifications.length > 0) {
      setTimeout(() => {
        inputRef.current?.focus();
        simulateClick(inputRef.current);
      }, 0);
    }
  }, [isClarifying, brandClarifications]);

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results.data || []
  );

  const uniqueResults = useMemo(() => dedupeResults(allResults), [allResults]);
  const filteredResults = useFilteredResults(uniqueResults, selectedSuppliers);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              sx={{ flexGrow: 1 }}
              freeSolo
              inputValue={inputValue}
              options={combinedOptions}
              filterOptions={(x) => x}
              getOptionLabel={(option) =>
                `${option.brand} - ${option.number} - ${option.descr}`
              }
              onInputChange={handleInputChange}
              getOptionKey={(option) => option.key}
              onChange={handleOptionSelect}
              renderInput={(params) => (
                <AutocompleteInput
                  params={params}
                  inputRef={inputRef}
                  isAutocompleteLoading={isAutocompleteLoading}
                  inputValue={inputValue}
                  hasOptions={Boolean(combinedOptions.length)}
                  handleClearInput={handleClearInput}
                />
              )}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrandClarification(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Уточнить бренд
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {Object.entries(supplierStatus).map(([supplierKey, status]) => (
              <SupplierStatusIndicator
                key={supplierKey}
                supplierKey={supplierKey}
                status={status}
                checked={selectedSuppliers.includes(supplierKey)}
                onChange={handleSupplierChange}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          {<MemoizedResultsTable allResults={filteredResults} />}
        </Grid>
      </Grid>
    </Container>
  );
};
