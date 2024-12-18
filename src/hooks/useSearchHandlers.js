import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';
import { resetSupplierStatus } from '../redux/supplierSlice';

const useSearchHandlers = ({ socket, selectedSuppliers }) => {
  const dispatch = useDispatch();

  const handleBrandClarification = useCallback(
    (value) => {
      const { article } = value;

      socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, {
        query: article,
        supplier: 'ug',
      });
    },
    [socket, selectedSuppliers]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      console.log(value, selectedSuppliers);
      selectedSuppliers.forEach((supplier) => {
        if (!supplier) {
          console.error('Invalid supplierKey:', supplier);
          return; // Skip invalid supplierKey
        }

        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          item: value,
          supplier: supplier,
        });
      });
    },
    [socket, selectedSuppliers]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      console.log('handleBrandSelect called with selectedItem:', selectedItem);
      dispatch(resetSupplierStatus());

      selectedSuppliers.forEach((supplierKey) => {
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          item: selectedItem,
          supplier: supplierKey,
        });
      });

      dispatch(clearBrandClarifications());
    },
    [dispatch, socket, selectedSuppliers]
  );

  const handleOptionSelect = useCallback(
    (_event, value) => {
      if (value) {
        const mappedValue = {
          brand: value.brand,
          article: value.number,
          description: value.descr || '',
        };
        dispatch(resetSupplierStatus());
        // console.log(value, mappedValue);

        const brand =
          typeof mappedValue === 'object' ? mappedValue.brand : mappedValue;
        const description = mappedValue.description;

        if (brand.trim().includes('Найти') && !description) {
          console.log('called brandClarification');
          handleBrandClarification(mappedValue);
        } else {
          console.log('called handleDetailedSearch');
          handleDetailedSearch(mappedValue);
        }
      }
    },
    [dispatch, handleBrandClarification, handleDetailedSearch]
  );

  return {
    handleBrandClarification,
    handleDetailedSearch,
    handleOptionSelect,
    handleBrandSelect,
  };
};

export default useSearchHandlers;
