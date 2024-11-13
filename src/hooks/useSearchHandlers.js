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
    (supplier) => {
      const session = sessions.find((s) => s.supplier === supplier);
      const sessionID = session ? session.sessionID : null;
      console.log(
        `getSessionIDForSupplier: supplier=${supplier}, sessionID=${sessionID}`
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
      selectedSuppliers.forEach((supplier) => {
        const sessionID = getSessionIDForSupplier(supplier);
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

      selectedSuppliers.forEach((supplier) => {
        const sessionID = getSessionIDForSupplier(supplier);
        console.log(
          `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, sessionID: ${sessionID}`
        );

        // Proceed even if sessionID is null (e.g., for 'profit')
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          sessionID,
          item: value,
          supplier,
        });
      });
    },
    [socket, selectedSuppliers, getSessionIDForSupplier]
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

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      console.log('handleBrandSelect called with selectedItem:', selectedItem);
      dispatch(resetSupplierStatus());

      selectedSuppliers.forEach((supplier) => {
        const sessionID = getSessionIDForSupplier(supplier);
        console.log(
          `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, sessionID: ${sessionID}`
        );

        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          sessionID,
          item: selectedItem,
          supplier,
        });
      });

      dispatch(clearBrandClarifications());
    },
    [dispatch, socket, selectedSuppliers, getSessionIDForSupplier]
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
