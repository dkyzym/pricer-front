import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSupplierSelection } from 'src/redux/supplierSlice';

export const useSupplierSelection = () => {
  const dispatch = useDispatch();

  const selectedSuppliers = useSelector(
    (state) => state.supplier.selectedSuppliers
  );

  const handleSupplierChange = useCallback(
    (supplierKey) => {
      // Вместо локального стейта диспатчим экшен, который обновит Redux и LocalStorage
      dispatch(toggleSupplierSelection(supplierKey));
    },
    [dispatch]
  );

  return { selectedSuppliers, handleSupplierChange };
};
