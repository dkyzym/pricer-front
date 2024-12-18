// import { SOCKET_EVENTS } from '@api/ws/socket';
// import { SocketContext } from '@context/SocketContext';
// import { useCallback, useContext } from 'react';

// const useAddToCart = () => {
//   const socket = useContext(SocketContext);

//   const addToCart = useCallback(
//     (count, item) => {
//       return new Promise((resolve, reject) => {
//         const handleSuccess = (data) => {
//           socket.off(SOCKET_EVENTS.ADD_TO_CART_SUCCESS, handleSuccess);
//           socket.off(SOCKET_EVENTS.ADD_TO_CART_ERROR, handleError);
//           resolve(data);
//         };
//         const handleError = (error) => {
//           socket.off(SOCKET_EVENTS.ADD_TO_CART_SUCCESS, handleSuccess);
//           socket.off(SOCKET_EVENTS.ADD_TO_CART_ERROR, handleError);
//           reject(error);
//         };

//         socket.on(SOCKET_EVENTS.ADD_TO_CART_SUCCESS, handleSuccess);
//         socket.on(SOCKET_EVENTS.ADD_TO_CART_ERROR, handleError);

//         socket.emit(SOCKET_EVENTS.ADD_TO_CART_REQUEST, {
//           count,
//           item,
//         });
//       });
//     },
//     [socket]
//   );

//   return { addToCart };
// };

// export default useAddToCart;

import { addToCart } from '@api/cart/cartApi';
import { useCallback } from 'react';

export default function useAddToCart() {
  const handleAddToCart = useCallback(async (itemData) => {
    /**
 * itemData: {
    supplier: string;
    innerId?: string;
    warehouse_id?: string;
    inner_product_code?: string;
    quantity: number;
  }
 */
    return await addToCart(itemData);
  }, []);

  return { addToCart: handleAddToCart };
}
