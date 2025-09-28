import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
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
  unsetLoading,
} from '../redux/brandClarificationSlice';

import {
  setSupplierArticle,
  setSupplierStatusError,
  setSupplierStatusLoading,
  setSupplierStatusSuccess,
} from '../redux/supplierSlice';

// Константа для таймаута в миллисекундах.
const CLIENT_SIDE_TIMEOUT_MS = 25000; // 25 секунд

export const useSocketManager = (socket) => {
  const dispatch = useDispatch();
  const store = useStore();

  // Используем useRef для хранения идентификаторов таймеров.
  // Это не вызывает перерисовку компонента при изменении.
  const supplierTimeoutRefs = useRef({});

  const handleSocketConnect = useCallback(() => {
    toast.info('WebSocket connected');
    dispatch(setAutocompleteResults([]));
    dispatch(clearBrandClarifications());
  }, [dispatch]);

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
      dispatch(unsetLoading());
    },
    [dispatch]
  );

  const handleBrandClarificationError = useCallback(
    (error) => {
      toast.error(`Brand Clarification Error: ${error.message}`);
      dispatch(setBrandClarificationError(error.message));
      dispatch(unsetLoading());
    },
    [dispatch]
  );

  // --- ИЗМЕНЕНИЯ НАЧИНАЮТСЯ ЗДЕСЬ ---

  const handleSupplierDataFetchStarted = useCallback(
    ({ supplier, article }) => {
      if (!supplier) {
        console.error(
          'Supplier is undefined in handleSupplierDataFetchStarted'
        );
        return;
      }

      dispatch(setSupplierStatusLoading(supplier));
      if (article) {
        dispatch(setSupplierArticle({ supplier, article }));
      }

      // Очищаем предыдущий таймер для этого поставщика, если он вдруг остался.
      if (supplierTimeoutRefs.current[supplier]) {
        clearTimeout(supplierTimeoutRefs.current[supplier]);
      }

      // Устанавливаем новый "сторожевой" таймер.
      supplierTimeoutRefs.current[supplier] = setTimeout(() => {
        // Проверяем актуальное состояние Redux.
        const currentStatus =
          store.getState().supplier.supplierStatus[supplier];

        // Если спинер все еще крутится, принудительно завершаем с ошибкой.
        if (currentStatus?.loading) {
          console.warn(`[Client Timeout] Supplier ${supplier} took too long.`);
          dispatch(
            setSupplierStatusError({
              supplier,
              error: 'Ответ от поставщика не получен вовремя.',
            })
          );
        }
        // Удаляем ссылку на таймер после его выполнения.
        delete supplierTimeoutRefs.current[supplier];
      }, CLIENT_SIDE_TIMEOUT_MS);
    },
    [dispatch, store]
  );

  const handleSupplierDataFetchSuccess = useCallback(
    ({ supplier, result }) => {
      // При получении успешного ответа, очищаем таймер.
      if (supplierTimeoutRefs.current[supplier]) {
        clearTimeout(supplierTimeoutRefs.current[supplier]);
        delete supplierTimeoutRefs.current[supplier];
      }

      if (!supplier) {
        console.error(
          'Supplier is undefined in handleSupplierDataFetchSuccess'
        );
        return;
      }

      dispatch(
        setSupplierStatusSuccess({
          supplier: supplier,
          results: result,
        })
      );
    },
    [dispatch]
  );

  const handleSupplierDataFetchError = useCallback(
    ({ supplier, error }) => {
      // При получении ошибки, также очищаем таймер.
      if (supplierTimeoutRefs.current[supplier]) {
        clearTimeout(supplierTimeoutRefs.current[supplier]);
        delete supplierTimeoutRefs.current[supplier];
      }

      console.error(`Error fetching data for supplier: ${supplier}`, error);
      dispatch(setSupplierStatusError({ supplier, error }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleSocketConnect);
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

    // Функция очистки при размонтировании компонента.
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleSocketConnect);
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

      // Очищаем ВСЕ активные таймеры, чтобы избежать утечек памяти.
      Object.values(supplierTimeoutRefs.current).forEach(clearTimeout);
    };
  }, [
    socket,
    handleSocketConnect,
    handleAutocompleteResults,
    handleAutocompleteError,
    handleBrandClarificationResults,
    handleBrandClarificationError,
    handleSupplierDataFetchStarted,
    handleSupplierDataFetchSuccess,
    handleSupplierDataFetchError,
  ]);
};
