import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  clearBrandClarifications,
  setLoading,
  setClarifyingArticle,
} from '../redux/brandClarificationSlice';
import { resetSupplierStatus } from '../redux/supplierSlice';
import { store } from '../redux/store';

export const useSearchHandlers = ({ socket, onStartClarify }) => {
  const dispatch = useDispatch();

  const handleBrandClarification = useCallback(
    (query) => {
      if (!query.trim()) {
        console.warn('Пустой запрос для уточнения бренда.');
        return;
      }

      dispatch(setLoading());
      dispatch(setClarifyingArticle(query.trim()));

      if (onStartClarify) {
        onStartClarify();
      }

      socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, { query: query.trim() });
    },
    [socket, dispatch, onStartClarify]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      const suppliers = store.getState().supplier.selectedSuppliers;
      suppliers.forEach((supplier) => {
        if (!supplier) {
          console.error('Invalid supplierKey:', supplier);
          return;
        }
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, { item: value, supplier });
      });
    },
    [socket]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      const suppliers = store.getState().supplier.selectedSuppliers;
      dispatch(resetSupplierStatus());
      suppliers.forEach((supplierKey) => {
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          item: selectedItem,
          supplier: supplierKey,
        });
      });
      dispatch(clearBrandClarifications());
    },
    [dispatch, socket]
  );

  const handleOptionSelect = useCallback(
    (_event, value) => {
      if (!value) return;

      const mappedValue = {
        brand: value.brand,
        article: value.number,
        description: value.descr || '',
      };

      dispatch(resetSupplierStatus());

      if (value.type === 'CLARIFY') {
        handleBrandClarification(mappedValue.article);
      } else {
        handleDetailedSearch(mappedValue);
        dispatch(clearBrandClarifications());
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
