import { QuantitySelector } from '@components/QuantitySelector/QuantitySelector';
import useAddToCart from '@hooks/useAddToCart';
import { Box } from '@mui/material';
import { CREDENTIALS } from '@utils/constants';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const AddToCartCell = (props) => {
  const { row } = props;
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useAddToCart();

  const sessions = useSelector((state) => state.session.sessions);

  // Helper functions to get sessionID and accountAlias for the supplier
  const getSessionIDForSupplier = (supplier, accountAlias) =>
    sessions.find(
      (s) => s.supplier === supplier && s.accountAlias === accountAlias
    )?.sessionID || null;

  const handleAddToCart = async (count) => {
    const numericCount = parseInt(count, 10);

    if (numericCount > Number(row.availability)) {
      toast.info('Нужно проверить количество');
      return;
    }
    setLoading(true);

    try {
      if (row.supplier === 'profit') {
        const data = {
          id: row.innerId,
          warehouse: row.warehouse_id,
          quantity: numericCount,
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
      } else {
        const sessionID = getSessionIDForSupplier(
          row.supplier,
          row.accountAlias
        );

        if (!sessionID) {
          toast.error(
            'Сессия не найдена для данного поставщика и accountAlias'
          );
          setLoading(false);
          return;
        }

        const res = await addToCart(
          numericCount,
          row,
          sessionID,
          row.accountAlias
        );
        setAdded(true);

        toast.success(res.result.message);
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
