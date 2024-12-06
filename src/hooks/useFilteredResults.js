import { useMemo } from 'react';

const useFilteredResults = (allResults, selectedSuppliers) =>
  useMemo(() => {
    return allResults.filter((item) =>
      selectedSuppliers.includes(item.supplier)
    );
  }, [allResults, selectedSuppliers]);

export default useFilteredResults;
