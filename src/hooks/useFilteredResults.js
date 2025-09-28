import { useMemo } from 'react';

const normalizeSupplier = (supplier) => (supplier === 'ug_f' ? 'ug' : supplier);

export const useFilteredResults = (allResults, selectedSuppliers) =>
  useMemo(() => {
    const normalizedSuppliers = selectedSuppliers.map(normalizeSupplier);

    return allResults.filter((item) =>
      normalizedSuppliers.includes(normalizeSupplier(item.supplier))
    );
  }, [allResults, selectedSuppliers]);
