import { QuantitySelector } from '@components/QuantitySelector/QuantitySelector';
import useAddToCart from '@hooks/useAddToCart';
import { Box } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const AddToCartCell = (props) => {
  const { row } = props;
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useAddToCart();

  const handleAddToCart = async (count) => {
    const numericCount = parseInt(count, 10);

    if (numericCount > Number(row.availability)) {
      toast.info('Нужно проверить количество');
      return;
    }
    setLoading(true);

    try {
      const data = {
        supplier: row.supplier,
        innerId: row.innerId,
        warehouse_id: row.warehouse_id,
        inner_product_code: row.inner_product_code,
        quantity: numericCount,
        brand: row.brand,
        number: row.article,
        price: row.price,
        article: row.article,
        autosputnik: row?.autosputnik || {},
        turboCars: row?.turboCars || {},
      };

      const res = await addToCart(data);
      if (res.success) {
        setAdded(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка при добавлении в корзину');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <QuantitySelector
        multi={row?.multi ?? 1}
        loading={loading}
        added={added}
        onAddToCart={handleAddToCart}
      />
    </Box>
  );
};
