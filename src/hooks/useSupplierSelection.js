import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useSupplierSelection = () => {
  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);
  const supplierKeys = useMemo(
    () => Object.keys(supplierStatus),
    [supplierStatus]
  );

  // Initialize selectedSuppliers with all suppliers, including 'profit'
  const [selectedSuppliers, setSelectedSuppliers] = useState(() =>
    supplierKeys.filter((key) => key !== 'undefined' && key)
  );

  // useEffect(() => {
  //   setSelectedSuppliers((prevSelected) => {
  //     const updatedSelected = prevSelected.filter((supplier) =>
  //       supplierKeys.includes(supplier)
  //     );
  //     const newSuppliers = supplierKeys.filter(
  //       (supplier) => !updatedSelected.includes(supplier)
  //     );
  //     return [...updatedSelected, ...newSuppliers];
  //   });
  // }, [supplierKeys]);

  useEffect(() => {
    // Обновление выбранных поставщиков при изменении списка поставщиков
    setSelectedSuppliers((prevSelected) => {
      const validSuppliers = supplierKeys.filter((key) =>
        prevSelected.includes(key)
      );
      return validSuppliers.length ? validSuppliers : supplierKeys;
    });
  }, [supplierKeys]);

  const handleSupplierChange = useCallback((supplierKey) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierKey)
        ? prev.filter((s) => s !== supplierKey)
        : [...prev, supplierKey]
    );
  }, []);

  return { selectedSuppliers, handleSupplierChange };
};

export default useSupplierSelection;
