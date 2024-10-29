import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { SOCKET_EVENTS } from '@api/ws/socket';
import { SocketContext } from '@context/SocketContext';

const useAddToCart = () => {
  const socket = useContext(SocketContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = useCallback(
    (count, item) => {
      setIsAddingToCart(true);
      socket.emit(SOCKET_EVENTS.ADD_TO_CART_REQUEST, { count, item });
    },
    [socket]
  );

  useEffect(() => {
    const handleAddToCartSuccess = (data) => {
      toast.success(data.message || 'Товар успешно добавлен в корзину');
      setIsAddingToCart(false);
    };

    const handleAddToCartError = (error) => {
      toast.error(error.message || 'Ошибка при добавлении в корзину');
      setIsAddingToCart(false);
    };

    socket.on(SOCKET_EVENTS.ADD_TO_CART_SUCCESS, handleAddToCartSuccess);
    socket.on(SOCKET_EVENTS.ADD_TO_CART_ERROR, handleAddToCartError);

    return () => {
      socket.off(SOCKET_EVENTS.ADD_TO_CART_SUCCESS, handleAddToCartSuccess);
      socket.off(SOCKET_EVENTS.ADD_TO_CART_ERROR, handleAddToCartError);
    };
  }, [socket]);

  return { addToCart, isAddingToCart };
};

export default useAddToCart;
