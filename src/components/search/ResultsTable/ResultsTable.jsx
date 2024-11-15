import { getColumns } from '@components/Columns/Columns';
import { useCalculatedValues } from '@hooks/useCalculateValues';
import { useEnrichedData } from '@hooks/useEnrichedData';
import { useFilteredData } from '@hooks/useFilteredData';
import { memo, useMemo, useState } from 'react';
import { DataGridWrapper } from '../DataGridWrapper/DataGridWrapper';
import { FilterControls } from '../FilterControls/FilterControls';

const ResultsTable = ({ allResults }) => {
  const [maxDeadline, setMaxDeadline] = useState('');
  const [maxDeliveryDate, setMaxDeliveryDate] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortModel, setSortModel] = useState([{ field: 'price', sort: 'asc' }]);
  const [minQuantity, setMinQuantity] = useState('');

  const filteredData = useFilteredData(
    allResults,
    maxDeadline,
    maxDeliveryDate,
    maxPrice,
    minQuantity
  );

  const { minPrice, minDeadline, maxProbability, minDeliveryDate } =
    useCalculatedValues(filteredData);

  const enrichedData = useEnrichedData(filteredData, {
    minPrice,
    minDeliveryDate,
  });
  // Определение столбцов с условным форматированием и иконками
  const columns = useMemo(
    () =>
      getColumns({ minPrice, minDeadline, maxProbability, minDeliveryDate }),
    [minPrice, minDeadline, maxProbability, minDeliveryDate]
  );

  return (
    <div>
      <FilterControls
        maxDeadline={maxDeadline}
        setMaxDeadline={setMaxDeadline}
        maxDeliveryDate={maxDeliveryDate}
        setMaxDeliveryDate={setMaxDeliveryDate}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minQuantity={minQuantity}
        setMinQuantity={setMinQuantity}
      />

      <DataGridWrapper
        rows={enrichedData}
        columns={columns}
        sortModel={sortModel}
        setSortModel={setSortModel}
      />
    </div>
  );
};

export const MemoizedResultsTable = memo(ResultsTable);

MemoizedResultsTable.displayName = 'MemoizedResultsTable';
