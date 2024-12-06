import { Autocomplete, Box, Container, Grid } from '@mui/material';
import { useContext, useRef } from 'react';

import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import { SupplierStatusIndicator } from '@components/indicators/SupplierStatusIndicator';
import useAutocomplete from '@hooks/useAutocomplete';

import { SocketContext } from '@context/SocketContext';
import useFilteredResults from '@hooks/useFilteredResults';
import useSearchHandlers from '@hooks/useSearchHandlers';
import useSocketManager from '@hooks/useSocketManager';
import useSupplierSelection from '@hooks/useSupplierSelection';
import {
  // useDispatch,
  useSelector,
} from 'react-redux';
// import {
//   setAutocompleteLoading,
//   setAutocompleteResults,
//   setInputValue,
// } from '../../redux/autocompleteSlice';
// import { clearBrandClarifications } from '../../redux/brandClarificationSlice';
// import { resetSupplierStatus } from '../../redux/supplierSlice';
// import { BrandClarificationTable } from './BrandClarificationTable/BrandClarificationTable';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);
  // const dispatch = useDispatch();

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

  // const brandClarifications = useSelector(
  //   (state) => state.brandClarification.brands
  // );
  // const isClarifying = useSelector(
  //   (state) => state.brandClarification.isClarifying
  // );

  const { selectedSuppliers, handleSupplierChange } = useSupplierSelection();

  // useEffect(() => {
  //   console.log('Selected Suppliers:', selectedSuppliers);
  // }, [selectedSuppliers]);

  const {
    handleOptionSelect,
    // handleBrandSelect
  } = useSearchHandlers({
    socket,
    // resetSupplierStatus: () => dispatch(resetSupplierStatus()),
    // clearBrandClarifications: () => dispatch(clearBrandClarifications()),
    selectedSuppliers,
  });

  const allResults = Object.values(supplierStatus).flatMap(
    (status) => status.results.data || []
  );

  // useEffect(() => {
  //   console.log(Object.entries(supplierStatus));
  // }, [Object.entries(supplierStatus)]);
  const filteredResults = useFilteredResults(allResults, selectedSuppliers);

  // useEffect(() => {
  //   console.log('filtered', filteredResults);
  // }, [filteredResults]);

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
                handleClearInput={handleClearInput}
              />
            )}
          />
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
        {/* {isClarifying && brandClarifications?.length > 0 && (
          <Grid item xs={12}>
            <BrandClarificationTable
              items={brandClarifications}
              onSelect={handleBrandSelect}
            />
          </Grid>
        )} */}
      </Grid>
    </Container>
  );
};
