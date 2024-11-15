import { useMemo } from 'react';

const useFilteredResults = (allResults, selectedSuppliers) =>
  useMemo(
    () =>
      allResults.filter((item) => selectedSuppliers.includes(item.supplierKey)),
    [allResults, selectedSuppliers]
  );

export default useFilteredResults;
