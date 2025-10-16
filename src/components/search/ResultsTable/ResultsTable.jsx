import { getColumns } from '@components/Columns/Columns';
import { useCalculatedValues } from '@hooks/useCalculateValues';
import { useEnrichedData } from '@hooks/useEnrichedData';
import { usePriceComparison } from '@hooks/usePriceComparison';
import { memo, useMemo, useState } from 'react';
import { DataGridWrapper } from '../DataGridWrapper/DataGridWrapper';


const ResultsTable = ({ data }) => {

  const [sortModel, setSortModel] = useState([{ field: 'price', sort: 'asc' }]);

  const { minPrice, minDeadline, maxProbability, minDeliveryDate } =
    useCalculatedValues(data);

  const enrichedData = useEnrichedData(data, {
    minPrice,
    minDeliveryDate,
  });

  const comparedData = usePriceComparison(enrichedData);

  const columns = useMemo(
    () =>
      getColumns({ minPrice, minDeadline, maxProbability, minDeliveryDate }),
    [minPrice, minDeadline, maxProbability, minDeliveryDate]
  );

  return (
    <div>
      <DataGridWrapper
        rows={comparedData}
        columns={columns}
        sortModel={sortModel}
        setSortModel={setSortModel}
      />
    </div>
  );
};

export const MemoizedResultsTable = memo(ResultsTable);
MemoizedResultsTable.displayName = 'MemoizedResultsTable';
