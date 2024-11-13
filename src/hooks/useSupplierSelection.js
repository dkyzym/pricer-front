import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useSupplierSelection = () => {
  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);
  const supplierKeys = useMemo(
    () => Object.keys(supplierStatus),
    [supplierStatus]
  );

  // Initialize selectedSuppliers with all suppliers, including 'profit'
  const [selectedSuppliers, setSelectedSuppliers] = useState(
    () => supplierKeys
  );

  useEffect(() => {
    setSelectedSuppliers((prevSelected) => {
      const updatedSelected = prevSelected.filter((supplier) =>
        supplierKeys.includes(supplier)
      );
      const newSuppliers = supplierKeys.filter(
        (supplier) => !updatedSelected.includes(supplier)
      );
      return [...updatedSelected, ...newSuppliers];
    });
  }, [supplierKeys]);

  const handleSupplierChange = useCallback((supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  }, []);

  return { selectedSuppliers, handleSupplierChange };
};

export default useSupplierSelection;
