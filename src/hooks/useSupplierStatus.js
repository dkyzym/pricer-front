import { useCallback, useState } from 'react';

const initialSupplierState = {
  profit: { loading: false, results: [], error: null },
  turboCars: { loading: false, results: [], error: null },
  ug: { loading: false, results: [], error: null },
  patriot: { loading: false, results: [], error: null },
};

const useSupplierStatus = () => {
  const [supplierStatus, setSupplierStatus] = useState(initialSupplierState);

  const resetSupplierStatus = useCallback(() => {
    setSupplierStatus((prevStatus) => {
      const newStatus = { ...prevStatus };
      Object.keys(newStatus).forEach((supplier) => {
        newStatus[supplier] = {
          ...newStatus[supplier],
          results: [],
          loading: false,
          error: null,
        };
      });
      return newStatus;
    });
  }, []);

  return {
    supplierStatus,
    setSupplierStatus,
    resetSupplierStatus,
  };
};

export default useSupplierStatus;
