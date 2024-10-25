import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import { Box, CircularProgress, IconButton, TextField } from '@mui/material';
import { CREDENTIALS } from '@utils/constants';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

export const AddToCartCell = (props) => {
  const { row } = props;
  const [quantity, setQuantity] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (
      !quantity ||
      parseInt(quantity, 10) <= 0 ||
      parseInt(quantity, 10) > Number(row.availability)
    ) {
      toast.info('нужно проверить количество');
      return;
    }

    setLoading(true);
    try {
      if (row.supplier === 'profit') {
        const data = {
          id: row.innerId,
          warehouse: row.warehouse_id,
          quantity: parseInt(quantity, 10),
          code: row.inner_product_code,
          supplier: row.supplier,
        };
        const url = CREDENTIALS['profit'].addToCartURL;

        const res = await axios.post(url, data);
        res.success ?? setQuantity('');
      }
      // Здесь добавим обработку  других suppliers
      setAdded(true);
    } catch (error) {
      console.error(error);
      // Опционально можно добавить отображение ошибки пользователю
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 0.1,
        // backgroundColor: 'red',
      }}
    >
      <TextField
        value={quantity}
        onChange={handleQuantityChange}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          min: 1,
        }}
        sx={{ ml: 1, minWidth: 35 }}
        variant="standard"
      />
      <IconButton onClick={handleAddToCart} disabled={loading || !quantity}>
        {loading ? (
          <CircularProgress size={24} />
        ) : added ? (
          <CheckIcon />
        ) : (
          <AddShoppingCartIcon />
        )}
      </IconButton>
    </Box>
  );
};