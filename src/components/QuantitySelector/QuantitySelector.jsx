import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, CircularProgress, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const QuantitySelector = ({
  multi = 1,
  loading,
  added,
  onAddToCart,
}) => {
  const [count, setCount] = useState(multi);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + multi);
  };

  const handleDecrement = () => {
    if (count > multi) {
      setCount((prevCount) => prevCount - multi);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === '') {
      setCount(0);
      return;
    }

    const value = parseInt(inputValue, 10);

    if (isNaN(value) || value <= 0) {
      toast.warn('Пожалуйста, введите допустимое положительное число');
      return;
    }

    if (value % multi !== 0) {
      toast.warn(`Число должно быть кратно ${multi}`);
      return;
    }

    setCount(value);
  };

  const handleAddToCartClick = () => {
    onAddToCart(count);
  };

  return (
    <Box width={100} display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={handleDecrement}
          color="primary"
          sx={{
            width: 15,
            height: 30,
            padding: 0,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <TextField
          value={count}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{
            width: 40,
            borderRadius: 1,
            '& input': {
              textAlign: 'center',
              padding: '2px',
            },
          }}
        />

        <IconButton
          onClick={handleIncrement}
          color="primary"
          sx={{
            borderRadius: 1,
            width: 15,
            height: 30,
            padding: 0,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <IconButton
        onClick={handleAddToCartClick}
        color={added ? 'primary' : 'default'}
        disabled={loading}
        sx={{
          borderRadius: 2,
          width: 20,
          height: 30,
          marginLeft: 1,
          transition: 'transform 0.2s, background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            transform: 'scale(1.1)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <ShoppingCartIcon fontSize="" />
        )}
      </IconButton>
    </Box>
  );
};
