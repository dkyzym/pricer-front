import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAutocompleteLoading,
  setAutocompleteResults,
} from '../../src/redux/autocompleteSlice';
import { clearAutocomplete } from '../redux/autocompleteSlice';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';
import { resetSupplierStatus } from '../redux/supplierSlice';

const useSearchHandlers = ({ socket, inputRef, selectedSuppliers }) => {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.session.sessions);

  const getSessionIDForSupplier = useCallback(
    (supplier, accountAlias) => {
      if (!supplier) {
        console.error('Supplier is undefined in getSessionIDForSupplier');
        return null;
      }

      const session = sessions.find(
        (s) => s.supplier === supplier && s.accountAlias === accountAlias
      );
      const sessionID = session ? session.sessionID : null;
      console.log(
        `getSessionIDForSupplier: supplier=${supplier}, accountAlias=${accountAlias}, sessionID=${sessionID}`
      );
      return sessionID;
    },
    [sessions]
  );

  const handleClearInput = useCallback(() => {
    dispatch(setAutocompleteResults([]));
    dispatch(setAutocompleteLoading(false));
    dispatch(clearAutocomplete(''));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dispatch, inputRef]);

  const handleBrandClarification = useCallback(
    (value) => {
      const { article } = value;
      selectedSuppliers.forEach((supplier, accountAlias) => {
        const sessionID = getSessionIDForSupplier(supplier, accountAlias);
        if (sessionID) {
          socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, {
            sessionID,
            article,
            supplier,
          });
        } else {
          console.error(`Session for supplier "${supplier}" not found`);
        }
      });
    },
    [socket, selectedSuppliers, getSessionIDForSupplier]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      console.log('handleDetailedSearch called with value:', value);

      selectedSuppliers.forEach((supplierKey) => {
        if (!supplierKey) {
          console.error('Invalid supplierKey:', supplierKey);
          return; // Skip invalid supplierKey
        }

        let supplier, accountAlias;
        if (supplierKey.includes('_')) {
          [supplier, accountAlias] = supplierKey.split('_');
        } else {
          supplier = supplierKey;
          accountAlias = null;
        }

        if (!supplier) {
          console.error('Supplier is undefined for supplierKey:', supplierKey);
          return; // Skip if supplier is undefined
        }

        const sessionID = getSessionIDForSupplier(supplier, accountAlias);
        console.log(
          `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, accountAlias: ${accountAlias}, sessionID: ${sessionID}`
        );
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          sessionID,
          item: value,
          supplier,
          accountAlias,
        });
      });
    },
    [socket, selectedSuppliers, getSessionIDForSupplier]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      console.log('handleBrandSelect called with selectedItem:', selectedItem);
      dispatch(resetSupplierStatus());

      selectedSuppliers.forEach((supplierKey) => {
        const [supplier, accountAlias] = supplierKey.split('_');
        const sessionID = getSessionIDForSupplier(supplier, accountAlias);
        console.log(
          `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, accountAlias: ${accountAlias}, sessionID: ${sessionID}`
        );

        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          sessionID,
          item: selectedItem,
          supplier,
          accountAlias,
        });
      });

      dispatch(clearBrandClarifications());
    },
    [dispatch, socket, selectedSuppliers, getSessionIDForSupplier]
  );

  const handleOptionSelect = useCallback(
    (_event, value) => {
      console.log('handleOptionSelect called with value:', value);
      if (value) {
        dispatch(resetSupplierStatus());
        if (value.brand.trim().includes('Найти') && !value.description) {
          console.log('Triggering handleBrandClarification');
          handleBrandClarification(value);
        } else {
          console.log('Triggering handleDetailedSearch');
          handleDetailedSearch(value);
        }
      }
    },
    [dispatch, handleBrandClarification, handleDetailedSearch]
  );

  return {
    handleClearInput,
    handleBrandClarification,
    handleDetailedSearch,
    handleOptionSelect,
    handleBrandSelect,
  };
};

export default useSearchHandlers;
