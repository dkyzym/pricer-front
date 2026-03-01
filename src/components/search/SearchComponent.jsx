import { ActionBar } from '@components/ActionBar/ActionBar';
import { SocketContext } from '@context/SocketContext';
import { useFilteredPipeline } from '@hooks/useFilteredPipeline';
import { useSearchAutocomplete } from '@hooks/useSearchAutocomplete';
import { useSocketManager } from '@hooks/useSocketManager';
import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';
import { SearchAutocompleteUI } from './SearchAutocompleteUI';

export const SearchComponent = () => {
  const socket = useContext(SocketContext);
  useSocketManager(socket);

  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);

  const searchAutocompleteProps = useSearchAutocomplete(socket);
  const { data, filterProps } = useFilteredPipeline(supplierStatus);

  return (
    <Container maxWidth="lg" sx={{ mt: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchAutocompleteUI {...searchAutocompleteProps} />
        </Grid>

        <Grid item xs={12}>
          <ActionBar supplierStatus={supplierStatus} {...filterProps} />
        </Grid>

        <Grid item xs={12}>
          <MemoizedResultsTable data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchComponent;
