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

/** @type {number} Таймаут ожидания ответа от поставщика (мс). По истечении — принудительный setSupplierStatusError. */
const CLIENT_SIDE_TIMEOUT_MS = 25000;

/**
 * @typedef {Object} SupplierFetchStartedPayload
 * @property {string} [supplier] — идентификатор поставщика
 * @property {string} [article] — артикул запроса
 */

/**
 * @typedef {Object} SupplierFetchSuccessPayload
 * @property {string} [supplier] — идентификатор поставщика
 * @property {SupplierResultSet} [result] — данные от поставщика
 */

/**
 * @typedef {Object} SupplierResultSet
 * @property {SupplierResultItem[]} [data] — массив предложений по артикулу
 */

/**
 * Данные одного предложения в агрегаторе запчастей (ответ поставщика).
 * @typedef {Object} SupplierResultItem
 * @property {string} [supplier] — идентификатор поставщика (например 'ug', 'ug_f')
 * @property {string} [article] — артикул
 * @property {number} [price] — цена
 * @property {string} [deliveryDate] — дата поставки (ISO)
 * @property {number|string} [availability] — наличие, кол-во
 * @property {number} [multi] — кратность отгрузки (проверка availability % multi === 0)
 */

/**
 * @typedef {Object} SupplierFetchErrorPayload
 * @property {string} [supplier] — идентификатор поставщика
 * @property {Error|string} [error] — ошибка
 */

/**
 * Подписывает сокет на события бренд-уточнения и запросов к поставщикам,
 * диспатчит результаты в Redux и ведёт клиентские таймауты по поставщикам.
 *
 * @param {import('socket.io-client').Socket | null} socket — экземпляр сокета
 */
export const useSocketManager = (socket) => {
  const dispatch = useDispatch();
  const store = useStore();

  const supplierTimeoutRefs = useRef({});

  /**
   * latestRef: обработчики в ref всегда видят актуальные dispatch/store;
   * стабильные обёртки в useEffect не переподписывают сокет при каждом рендере.
   */
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

      if (supplierTimeoutRefs.current[supplier]) {
        clearTimeout(supplierTimeoutRefs.current[supplier]);
      }

      supplierTimeoutRefs.current[supplier] = setTimeout(() => {
        const currentStatus =
          store.getState().supplier.supplierStatus[supplier];

        if (currentStatus?.loading) {
          console.warn(`[Client Timeout] Supplier ${supplier} took too long.`);
          dispatch(
            setSupplierStatusError({
              supplier,
              error: 'Ответ от поставщика не получен вовремя.',
            })
          );
        }
        delete supplierTimeoutRefs.current[supplier];
      }, CLIENT_SIDE_TIMEOUT_MS);
    },

    handleSupplierDataFetchSuccess({ supplier, result }) {
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

      Object.values(supplierTimeoutRefs.current).forEach(clearTimeout);
    };
  }, [socket]);
};
