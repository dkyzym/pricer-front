import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useSocketManager = (
  socket,
  { setAutocompleteResults, setIsAutocompleteLoading, setSupplierStatus }
) => {
  const [brandClarifications, setBrandClarifications] = useState([]);
  const [isClarifying, setIsClarifying] = useState(false);

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');

    setAutocompleteResults([]);
    setBrandClarifications([]);
    setIsClarifying(false);
  }, []);

  const handleAutocompleteResults = useCallback(
    ({ results }) => {
      setAutocompleteResults(results?.data || []);
      setIsAutocompleteLoading(false);
    },
    [setAutocompleteResults, setIsAutocompleteLoading]
  );

  const handleAutocompleteErrorWrapper = useCallback((error) => {
    toast.error(error.message);
    setAutocompleteResults([]);
    setIsAutocompleteLoading(false);
  }, []);

  const handleBrandClarificationResults = useCallback((data) => {
    toast.success(data?.message);

    setBrandClarifications(data?.brands);
    setIsClarifying(true);
  }, []);

  const handleBrandClarificationErrorWrapper = useCallback(
    (error) => {
      toast.error(error.message);
      setIsClarifying(false);
    },
    [setIsClarifying]
  );

  const handleSupplierDataFetchStarted = useCallback(({ supplier }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: { ...prevStatus[supplier], loading: true, error: null },
    }));
  }, []);

  const handleSupplierDataFetchSuccess = useCallback(({ supplier, result }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: {
        ...prevStatus[supplier],
        loading: false,
        results: result?.data || [],
        error: null,
      },
    }));
  }, []);

  const handleSupplierDataFetchError = useCallback(({ supplier, error }) => {
    setSupplierStatus((prevStatus) => ({
      ...prevStatus,
      [supplier]: {
        ...prevStatus[supplier],
        loading: false,
        error,
      },
    }));
  }, []);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CONNECT, handleSocketConnect);
    socket.on(SOCKET_EVENTS.AUTOCOMPLETE_RESULTS, handleAutocompleteResults);
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
      handleBrandClarificationResults
    );
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
      handleBrandClarificationErrorWrapper
    );
    socket.on(SOCKET_EVENTS.AUTOCOMPLETE_ERROR, handleAutocompleteErrorWrapper);
    socket.on(
      SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED,
      handleSupplierDataFetchStarted
    );
    socket.on(
      SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS,
      handleSupplierDataFetchSuccess
    );
    socket.on(
      SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR,
      handleSupplierDataFetchError
    );

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleSocketConnect);
      socket.off(SOCKET_EVENTS.AUTOCOMPLETE_RESULTS, handleAutocompleteResults);
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
        handleBrandClarificationResults
      );
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
        handleBrandClarificationErrorWrapper
      );
      socket.off(
        SOCKET_EVENTS.AUTOCOMPLETE_ERROR,
        handleAutocompleteErrorWrapper
      );
      socket.off(
        SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED,
        handleSupplierDataFetchStarted
      );
      socket.off(
        SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS,
        handleSupplierDataFetchSuccess
      );
      socket.off(
        SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR,
        handleSupplierDataFetchError
      );
    };
  }, [
    socket,
    handleSocketConnect,
    handleAutocompleteResults,
    handleBrandClarificationResults,
    handleBrandClarificationErrorWrapper,
    handleAutocompleteErrorWrapper,
    handleSupplierDataFetchStarted,
    handleSupplierDataFetchSuccess,
    handleSupplierDataFetchError,
  ]);

  return {
    brandClarifications,
    isClarifying,
    setIsClarifying,
    setBrandClarifications,
  };
};

export default useSocketManager;
