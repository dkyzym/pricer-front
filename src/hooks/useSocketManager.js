import { useEffect, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { toast } from 'react-toastify';

import { SOCKET_EVENTS } from '@api/ws/socket';
import { setAutocompleteResults } from '../redux/autocompleteSlice';
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

  // latestRef-паттерн: храним обработчики в ref, чтобы они всегда
  // имели актуальный скоуп (dispatch, store), но их «обёртки» в useEffect
  // оставались стабильными и не вызывали переподписок.
  const handlersRef = useRef(null);

  handlersRef.current = {
    handleSocketConnect() {
      toast.info('WebSocket connected');
      dispatch(setAutocompleteResults([]));
      dispatch(clearBrandClarifications());
    },

    handleBrandClarificationResults(data) {
      toast.success(data?.message);
      dispatch(setBrandClarifications(data?.brands));
      dispatch(unsetLoading());
    },

    handleBrandClarificationError(error) {
      toast.error(`Brand Clarification Error: ${error.message}`);
      dispatch(setBrandClarificationError(error.message));
      dispatch(unsetLoading());
    },

    // --- Supplier handlers ---

    handleSupplierDataFetchStarted({ supplier, article }) {
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

    handleSupplierDataFetchSuccess({ supplier, result }) {
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

    handleSupplierDataFetchError({ supplier, error }) {
      // При получении ошибки, также очищаем таймер.
      if (supplierTimeoutRefs.current[supplier]) {
        clearTimeout(supplierTimeoutRefs.current[supplier]);
        delete supplierTimeoutRefs.current[supplier];
      }

      console.error(`Error fetching data for supplier: ${supplier}`, error);
      dispatch(setSupplierStatusError({ supplier, error }));
    },
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Тонкие обёртки: ссылка на функцию стабильна, но внутри
    // всегда вызывается актуальная версия из handlersRef.current.
    const onConnect = (...args) =>
      handlersRef.current.handleSocketConnect(...args);
    const onBrandClarificationResults = (...args) =>
      handlersRef.current.handleBrandClarificationResults(...args);
    const onBrandClarificationError = (...args) =>
      handlersRef.current.handleBrandClarificationError(...args);
    const onSupplierStarted = (...args) =>
      handlersRef.current.handleSupplierDataFetchStarted(...args);
    const onSupplierSuccess = (...args) =>
      handlersRef.current.handleSupplierDataFetchSuccess(...args);
    const onSupplierError = (...args) =>
      handlersRef.current.handleSupplierDataFetchError(...args);

    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
      onBrandClarificationResults
    );
    socket.on(
      SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
      onBrandClarificationError
    );
    socket.on(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED, onSupplierStarted);
    socket.on(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS, onSupplierSuccess);
    socket.on(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR, onSupplierError);

    // Функция очистки при размонтировании компонента.
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_RESULTS,
        onBrandClarificationResults
      );
      socket.off(
        SOCKET_EVENTS.BRAND_CLARIFICATION_ERROR,
        onBrandClarificationError
      );
      socket.off(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_STARTED, onSupplierStarted);
      socket.off(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_SUCCESS, onSupplierSuccess);
      socket.off(SOCKET_EVENTS.SUPPLIER_DATA_FETCH_ERROR, onSupplierError);

      // Очищаем ВСЕ активные таймеры, чтобы избежать утечек памяти.
      Object.values(supplierTimeoutRefs.current).forEach(clearTimeout);
    };
  }, [socket]);
};
