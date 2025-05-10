import { QuantitySelector } from '@components/QuantitySelector/QuantitySelector';
import useAddToCart from '@hooks/useAddToCart';
import { Box } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { PaymentDialog } from '@components/PaymentDialog/PaymentDialog';

export const AddToCartCell = (props) => {
  const { row } = props;
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { addToCart } = useAddToCart();

  // Здесь хранится значение "нал или не нал"
  // Можно хранить прямо в handleAddToCart, но если нужно отдельное состояние, то вынести
  // const [nal, setNal] = useState(null);

  const handleAddToCart = async (count, nal) => {
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

      // Если это turboCars, добавляем поле nal (true / false)
      if (row.supplier === 'turboCars') {
        data.turboCars = {
          ...row.turboCars,
          nal, // true или false, как пришло из диалога
        };
      }

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

  // Эта функция будет вызываться при нажатии на "Добавить в корзину" в QuantitySelector
  // Если поставщик turboCars, сначала откроем диалог
  const handleCheckSupplierAndAdd = (count) => {
    if (row.supplier === 'turboCars') {
      setPaymentDialogOpen(true);
      // Сохранить count в каком-то стейте, чтобы потом передать в handleAddToCart.
      // Можно просто воспользоваться колбэком onSelect
      // В данном случае сделаем так: передадим count через setState
      setTemporaryCount(count);
    } else {
      // Иначе добавляем без диалога
      handleAddToCart(count, null);
    }
  };

  // Нужно сохранить count, на момент клика
  const [temporaryCount, setTemporaryCount] = useState(0);

  // Когда пользователь выбрал одну из опций в диалоге
  const handlePaymentSelect = (nalValue) => {
    setPaymentDialogOpen(false);
    handleAddToCart(temporaryCount, nalValue);
  };
  const disabledAddToCartSuppliers = [
    'autosputnik',
    // 'patriot',
    'turboCars',
    'autoImpulse',
    'armtek',
  ].includes(row.supplier);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <QuantitySelector
          multi={row?.multi ?? 1}
          loading={loading}
          disabledAddToCartSuppliers={Boolean(disabledAddToCartSuppliers)}
          added={added}
          // вместо handleAddToCart передаем новую функцию
          onAddToCart={handleCheckSupplierAndAdd}
        />
      </Box>

      {/* Диалог оплаты (появится, только если supplier === 'turboCars') */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSelect={handlePaymentSelect} // nal = true / false
      />
    </>
  );
};
