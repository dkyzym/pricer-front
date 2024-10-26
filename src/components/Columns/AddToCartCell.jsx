import { QuantitySelector } from '@components/QuantitySelector/QuantitySelector';
import { Box } from '@mui/material';
import { CREDENTIALS } from '@utils/constants';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

export const AddToCartCell = (props) => {
  const { row } = props;

  const [loading, setLoading] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = async (count) => {
    // Валидация количества
    if (count > Number(row.availability)) {
      toast.info('Нужно проверить количество');
      return;
    }

    setLoading(true);
    try {
      if (row.supplier === 'profit') {
        const data = {
          id: row.innerId,
          warehouse: row.warehouse_id,
          quantity: parseInt(count, 10),
          code: row.inner_product_code,
          supplier: row.supplier,
        };
        const url = CREDENTIALS['profit'].addToCartURL;

        const res = await axios.post(url, data);
        if (res.data.success) {
          setAdded(true);
          toast.success('Товар добавлен в корзину');
        } else {
          toast.error('Ошибка добавления в корзину');
        }
      }
      // Здесь добавьте обработку других поставщиков, если необходимо
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
        multi={row?.multi || 1}
        loading={loading}
        added={added}
        onAddToCart={handleAddToCart}
      />
    </Box>
  );
};
