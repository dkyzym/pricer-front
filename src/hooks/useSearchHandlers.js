import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';

const useSearchHandlers = ({
  socket,
  resetSupplierStatus,
  setBrandClarifications,
  setIsClarifying,
  inputRef,
  setInputValue,
  setAutocompleteResults,
  setIsAutocompleteLoading,
}) => {
  const handleClearInput = useCallback(() => {
    setInputValue('');
    setAutocompleteResults([]);
    setIsAutocompleteLoading(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [
    setInputValue,
    setAutocompleteResults,
    setIsAutocompleteLoading,
    inputRef,
  ]);

  const handleBrandClarification = useCallback(
    (value) => {
      const { article } = value;
      socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, article);
    },
    [socket]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, value);
    },
    [socket]
  );

  const handleOptionSelect = useCallback(
    (_event, value) => {
      if (value) {
        resetSupplierStatus();

        if (value.brand.trim().includes('Найти') && !value.description) {
          handleBrandClarification(value);
        } else {
          handleDetailedSearch(value);
        }
      }
    },
    [resetSupplierStatus, handleBrandClarification, handleDetailedSearch]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      resetSupplierStatus();

      socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, selectedItem);
      setBrandClarifications([]);
      setIsClarifying(false);
    },
    [resetSupplierStatus, socket, setBrandClarifications, setIsClarifying]
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
