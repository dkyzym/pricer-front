import { useCallback, useState } from 'react';

const useSupplierSelection = (supplierStatus) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState(() =>
    Object.keys(supplierStatus)
  );

  const handleSupplierChange = useCallback((supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  }, []);

  return {
    selectedSuppliers,
    handleSupplierChange,
  };
};

export default useSupplierSelection;
