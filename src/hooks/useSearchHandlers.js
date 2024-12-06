import { SOCKET_EVENTS } from '@api/ws/socket';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearBrandClarifications } from '../redux/brandClarificationSlice';
import { resetSupplierStatus } from '../redux/supplierSlice';

const useSearchHandlers = ({ socket, selectedSuppliers }) => {
  const dispatch = useDispatch();

  // const sessions = useSelector((state) => state.session.sessions);

  // const getSessionIDForSupplier = useCallback(
  //   (supplier, accountAlias) => {
  //     if (!supplier) {
  //       console.error('Supplier is undefined in getSessionIDForSupplier');
  //       return null;
  //     }

  //     const session = sessions.find(
  //       (s) => s.supplier === supplier && s.accountAlias === accountAlias
  //     );
  //     const sessionID = session ? session.sessionID : null;
  //     // console.log(
  //     //   `getSessionIDForSupplier: supplier=${supplier}, accountAlias=${accountAlias}, sessionID=${sessionID}`
  //     // );
  //     return sessionID;
  //   },
  //   [sessions]
  // );

  const handleBrandClarification = useCallback(
    (value) => {
      const { article } = value;

      // const ugSession = sessions.find(
      //   (session) => session.supplier === 'ug' && session.accountAlias === 'nal'
      // );

      // const sessionID = ugSession ? ugSession.sessionID : null;

      // if (sessionID) {
      socket.emit(SOCKET_EVENTS.BRAND_CLARIFICATION, {
        // sessionID,
        query: article,
        supplier: 'ug',
        // accountAlias: 'nal',
      });
      // } else {
      //   console.error(`Error inside handleBrandClarification`);
      // }
    },
    [socket, selectedSuppliers]
  );

  const handleDetailedSearch = useCallback(
    (value) => {
      // console.log('handleDetailedSearch called with value:', value);
      console.log(value, selectedSuppliers);
      selectedSuppliers.forEach((supplier) => {
        if (!supplier) {
          console.error('Invalid supplierKey:', supplier);
          return; // Skip invalid supplierKey
        }

        // let supplier, accountAlias;
        // if (supplierKey.includes('_')) {
        //   [supplier, accountAlias] = supplierKey.split('_');
        // } else {
        //   supplier = supplierKey;
        //   accountAlias = null;
        // }

        // if (!supplier) {
        //   console.error('Supplier is undefined for supplierKey:', supplierKey);
        //   return; // Skip if supplier is undefined
        // }

        // const sessionID = getSessionIDForSupplier(supplier, accountAlias);
        // console.log(
        //   `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, accountAlias: ${accountAlias}, sessionID: ${sessionID}`
        // );
        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          // sessionID,
          item: value,
          supplier: supplier,
          // accountAlias,
        });
      });
    },
    [socket, selectedSuppliers]
  );

  const handleBrandSelect = useCallback(
    (selectedItem) => {
      console.log('handleBrandSelect called with selectedItem:', selectedItem);
      dispatch(resetSupplierStatus());

      selectedSuppliers.forEach((supplierKey) => {
        // const [supplier, accountAlias] = supplierKey.split('_');
        // const sessionID = getSessionIDForSupplier(supplier, accountAlias);
        console
          .log
          // `Emitting GET_ITEM_RESULTS for supplier: ${supplier}, accountAlias: ${accountAlias}, sessionID: ${sessionID}`
          ();

        socket.emit(SOCKET_EVENTS.GET_ITEM_RESULTS, {
          // sessionID,
          item: selectedItem,
          supplier: supplierKey,
          // accountAlias,
        });
      });

      dispatch(clearBrandClarifications());
    },
    [dispatch, socket, selectedSuppliers]
  );

  const handleOptionSelect = useCallback(
    (_event, value) => {
      if (value) {
        const mappedValue = {
          brand: value.brand,
          article: value.number,
          description: value.descr || '',
        };
        dispatch(resetSupplierStatus());
        // console.log(value, mappedValue);

        const brand =
          typeof mappedValue === 'object' ? mappedValue.brand : mappedValue;
        const description = mappedValue.description;

        if (brand.trim().includes('Найти') && !description) {
          console.log('called brandClarification');
          handleBrandClarification(mappedValue);
        } else {
          console.log('called handleDetailedSearch');
          handleDetailedSearch(mappedValue);
        }
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

export default useSearchHandlers;
