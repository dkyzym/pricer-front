import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { SOCKET_EVENTS } from '@api/ws/socket';
import {
  setAutocompleteError,
  setAutocompleteLoading,
  setAutocompleteResults,
} from '../redux/autocompleteSlice';
import {
  clearBrandClarifications,
  setBrandClarificationError,
  setBrandClarifications,
} from '../redux/brandClarificationSlice';
import { setSessionError, setSessions } from '../redux/sessionSlice';
import {
  setSupplierArticle,
  setSupplierStatus,
  setSupplierStatusError,
  setSupplierStatusLoading,
  setSupplierStatusSuccess,
} from '../redux/supplierSlice';

const useSocketManager = (socket) => {
  const dispatch = useDispatch();

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');

    dispatch(setAutocompleteResults([]));
    dispatch(clearBrandClarifications());
  }, [dispatch]);

  const handleSessionsCreated = useCallback(
    (sessions) => {
      console.log('sessions ', sessions);
      dispatch(setSessions(sessions));
      toast.success('Sessions created successfully');

      const supplierStatusData = {};
      sessions.forEach((session) => {
        const supplier = session.supplier;
        if (supplier) {
          supplierStatusData[supplier] = {
            loading: false,
            results: [],
            error: null,
          };
        }
      });

      // Include 'profit' in supplierStatusData
      supplierStatusData['profit'] = {
        loading: false,
        results: [],
        error: null,
      };

      dispatch(setSupplierStatus(supplierStatusData));
    },
    [dispatch]
  );

  const handleSessionsError = useCallback(
    (error) => {
      dispatch(setSessionError(error.message));
      toast.error(`Session Error: ${error.message}`);
    },
    [dispatch]
  );

  const handleAutocompleteResults = useCallback(
    ({ results }) => {
      dispatch(setAutocompleteResults(results?.data || []));
      dispatch(setAutocompleteLoading(false));
    },
    [dispatch]
  );

  const handleAutocompleteError = useCallback(
    (error) => {
      toast.error(`Autocomplete Error: ${error.message}`);
      dispatch(setAutocompleteResults([]));
      dispatch(setAutocompleteLoading(false));
      dispatch(setAutocompleteError(error.message));
    },
    [dispatch]
  );

  const handleBrandClarificationResults = useCallback(
    (data) => {
      toast.success(data?.message);
      dispatch(setBrandClarifications(data?.brands));
    },
    [dispatch]
  );

  const handleBrandClarificationError = useCallback(
    (error) => {
      toast.error(`Brand Clarification Error: ${error.message}`);
      dispatch(setBrandClarificationError(error.message));
    },
    [dispatch]
  );

  const handleSupplierDataFetchStarted = useCallback(
    ({ supplier, article }) => {
      console.log(
        `Fetching data started for supplier: ${supplier}, article: ${article}`
      );
      dispatch(setSupplierStatusLoading(supplier));
      if (supplier === 'profit' && article) {
        dispatch(setSupplierArticle({ supplier, article }));
      }
    },
    [dispatch]
  );

  const handleSupplierDataFetchSuccess = useCallback(
    ({ supplier, result }) => {
      console.log(`Fetching data succeeded for supplier: ${supplier}`, result);
      dispatch(
        setSupplierStatusSuccess({ supplier, results: result?.data || [] })
      );
    },
    [dispatch]
  );

  const handleSupplierDataFetchError = useCallback(
    ({ supplier, error }) => {
      console.error(`Error fetching data for supplier: ${supplier}`, error);
      dispatch(setSupplierStatusError({ supplier, error }));
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CONNECT, handleSocketConnect);
    socket.on(SOCKET_EVENTS.SESSIONS_CREATED, handleSessionsCreated);
    socket.on(SOCKET_EVENTS.SESSIONS_ERROR, handleSessionsError);
    socket.on(SOCKET_EVENTS.AUTOCOMPLETE_RESULTS, handleAutocompleteResults);
    socket.on(SOCKET_EVENTS.AUTOCOMPLETE_ERROR, handleAutocompleteError);
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
      handleBrandClarificationResults
    );
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
      handleBrandClarificationError
    );
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

    // Очистка подписок при размонтировании
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleSocketConnect);
      socket.off(SOCKET_EVENTS.SESSIONS_CREATED, handleSessionsCreated);
      socket.off(SOCKET_EVENTS.SESSIONS_ERROR, handleSessionsError);
      socket.off(SOCKET_EVENTS.AUTOCOMPLETE_RESULTS, handleAutocompleteResults);
      socket.off(SOCKET_EVENTS.AUTOCOMPLETE_ERROR, handleAutocompleteError);
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
        handleBrandClarificationResults
      );
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
        handleBrandClarificationError
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
    handleSessionsCreated,
    handleSessionsError,
    handleAutocompleteResults,
    handleAutocompleteError,
    handleBrandClarificationResults,
    handleBrandClarificationError,
    handleSupplierDataFetchStarted,
    handleSupplierDataFetchSuccess,
    handleSupplierDataFetchError,
  ]);
};

export default useSocketManager;
