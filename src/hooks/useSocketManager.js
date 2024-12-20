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
// import { setSessionError, setSessions } from '../redux/sessionSlice';
import {
  setSupplierArticle,
  // setSupplierStatus,
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

  // const handleSessionsCreated = useCallback(
  //   (sessions) => {
  //     dispatch(setSessions(sessions));
  //     toast.success('Sessions created successfully');

  //     const supplierStatusData = {};
  //     sessions.forEach((session) => {
  //       const { supplier, accountAlias } = session;
  //       if (!supplier) {
  //         console.error('Session has undefined supplier:', session);
  //         return; // Skip this session
  //       }

  //       const key = accountAlias ? `${supplier}_${accountAlias}` : supplier;
  //       supplierStatusData[key] = {
  //         loading: false,
  //         results: [],
  //         error: null,
  //       };
  //     });

  //     supplierStatusData['profit'] = {
  //       loading: false,
  //       results: [],
  //       error: null,
  //     };

  //     supplierStatusData['ug'] = {
  //       loading: false,
  //       results: [],
  //       error: null,
  //     };

  //     supplierStatusData['turboCars'] = {
  //       loading: false,
  //       results: [],
  //       error: null,
  //     };

  //     dispatch(setSupplierStatus(supplierStatusData));
  //   },
  //   [dispatch]
  // );

  // const handleSessionsError = useCallback(
  //   (error) => {
  //     dispatch(setSessionError(error.message));
  //     toast.error(`Session Error: ${error.message}`);
  //   },
  //   [dispatch]
  // );

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
      if (!supplier) {
        console.error(
          'Supplier is undefined in handleSupplierDataFetchStarted'
        );
        return;
      }
      // console.log(
      //   `Fetching data started for supplier: ${supplier}, accountAlias: ${accountAlias}, article: ${article}`
      // );
      const supplierKey = supplier;

      dispatch(setSupplierStatusLoading(supplierKey));
      if (article) {
        dispatch(setSupplierArticle({ supplier: supplierKey, article }));
      }
    },
    [dispatch]
  );

  const handleSupplierDataFetchSuccess = useCallback(
    ({ supplier, result }) => {
      if (!supplier) {
        console.error(
          'Supplier is undefined in handleSupplierDataFetchSuccess'
        );
        return;
      }
      const supplierKey = supplier;

      // const effectiveAccountAlias = 'nal';

      // const resultsWithAccountAlias =
      //   result?.data.map((item) => ({
      //     ...item,
      //     supplierKey,
      //   })) || [];

      dispatch(
        setSupplierStatusSuccess({
          supplier: supplierKey,
          results: result,
        })
      );
    },
    [dispatch]
  );

  const handleSupplierDataFetchError = useCallback(
    ({ supplier, error }) => {
      console.error(`Error fetching data for supplier: ${supplier}`, error);
      const supplierKey = supplier;
      dispatch(setSupplierStatusError({ supplier: supplierKey, error }));
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CONNECT, handleSocketConnect);
    // socket.on(SOCKET_EVENTS.SESSIONS_CREATED, handleSessionsCreated);
    // socket.on(SOCKET_EVENTS.SESSIONS_ERROR, handleSessionsError);
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
      // socket.off(SOCKET_EVENTS.SESSIONS_CREATED, handleSessionsCreated);
      // socket.off(SOCKET_EVENTS.SESSIONS_ERROR, handleSessionsError);
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
    // handleSessionsCreated,
    // handleSessionsError,
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
