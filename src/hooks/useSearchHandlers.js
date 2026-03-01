import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  clearBrandClarifications,
  setLoading,
} from '../redux/brandClarificationSlice';

import { resetSupplierStatus } from '../redux/supplierSlice';

export const useSearchHandlers = ({ socket, selectedSuppliers }) => {
  const dispatch = useDispatch();

  const handleBrandClarification = useCallback(
    (query) => {
      if (!query.trim()) {
        console.warn('Пустой запрос для уточнения бренда.');
        return;
      }
      dispatch(setLoading());
      socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, { query });
    },
    [socket, dispatch]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      selectedSuppliers.forEach((supplier) => {
        if (!supplier) {
          console.error('Invalid supplierKey:', supplier);
          return;
        }
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, { item: value, supplier });
      });
    },
    [socket, selectedSuppliers]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
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
        const { brand, description } = mappedValue;
        if (brand.trim().includes('Найти') && !description) {
          handleBrandClarification(mappedValue.article);
        } else {
          handleDetailedSearch(mappedValue);
          dispatch(clearBrandClarifications());
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
