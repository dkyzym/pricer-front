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

/**
 * @typedef {Object} UseSearchHandlersParams
 * @property {import('socket.io-client').Socket | null} socket
 * @property {function(): void} [onStartClarify] — вызывается перед отправкой BRAND_CLARIFICATION (например сброс поля ввода)
 */

/**
 * Элемент, отправляемый на бэкенд: артикул/бренд + описание для запроса к поставщикам.
 * @typedef {Object} SearchItemPayload
 * @property {string} [brand]
 * @property {string} [article] — артикул (number из опции автокомплита)
 * @property {string} [description]
 */

/**
 * @typedef {Object} UseSearchHandlersReturn
 * @property {function(string): void} handleBrandClarification — запрос уточнения бренда по артикулу
 * @property {function(SearchItemPayload): void} handleDetailedSearch — запрос результатов по выбранной опции (всем выбранным поставщикам)
 * @property {function(React.SyntheticEvent, object|null): void} handleOptionSelect — выбор в Autocomplete (CLARIFY → уточнение бренда, иначе detailed search)
 * @property {function(object): void} handleBrandSelect — выбор бренда из уточнения; запрос по всем поставщикам
 */

/**
 * Обработчики поиска и уточнения бренда: эмит сокет-событий + обновление Redux.
 * selectedSuppliers берётся через store.getState() внутри колбэков, чтобы не включать в зависимости и не пересоздавать обработчики при смене выбора поставщиков.
 *
 * @param {UseSearchHandlersParams} params
 * @returns {UseSearchHandlersReturn}
 */
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
