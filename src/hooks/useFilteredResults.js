import { useMemo } from 'react';

const useFilteredResults = (allResults, selectedSuppliers) => {
  return useMemo(
    () =>
      allResults.filter((item) => selectedSuppliers.includes(item.supplier)),
    [allResults, selectedSuppliers]
  );
};

export default useFilteredResults;
