import { ActionBar } from '@components/ActionBar/ActionBar';
import { SocketContext } from '@context/SocketContext';
import { useFilteredPipeline } from '@hooks/useFilteredPipeline';
import { useSearchAutocomplete } from '@hooks/useSearchAutocomplete';
import { useSocketManager } from '@hooks/useSocketManager';
import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import { MemoizedResultsTable } from './ResultsTable/ResultsTable';
import { SearchAutocompleteUI } from './SearchAutocompleteUI';

/**
 * Корневой компонент поиска: сокет-менеджер (side-effect), автокомплит, фильтры, таблица результатов.
 * useSocketManager вызывается без возвращаемого значения — только подписка на события.
 */
export const SearchComponent = () => {
  const socket = useContext(SocketContext);
  useSocketManager(socket);

  const searchAutocompleteProps = useSearchAutocomplete(socket);
  const { data, filterProps } = useFilteredPipeline();

  return (
    <Container maxWidth="lg" sx={{ mt: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SearchAutocompleteUI {...searchAutocompleteProps} />
        </Grid>

        <Grid item xs={12}>
          <ActionBar {...filterProps} />
        </Grid>

        <Grid item xs={12}>
          <MemoizedResultsTable data={data} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchComponent;
