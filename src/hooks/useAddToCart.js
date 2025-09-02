import { addToCart } from '@api/cart/cartApi';
import { useCallback } from 'react';

export default function useAddToCart() {
  const handleAddToCart = useCallback(async (itemData) => {
    return await addToCart(itemData);
  }, []);

  return { addToCart: handleAddToCart };
}
