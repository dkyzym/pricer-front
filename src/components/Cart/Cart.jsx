import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

const QuantitySelector = ({ multi = 4 }) => {
  const [count, setCount] = useState(multi);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + multi);
  };

  const handleDecrement = () => {
    if (count > 1) {
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

  return (
    <Box width={100} display="flex" alignItems="center">
      <Box border="1px solid gray" display="flex" alignItems="center">
        {/* Button to decrement quantity */}
        <IconButton
          onClick={handleDecrement}
          color="primary"
          sx={{
            borderRadius: 1,
            width: 15,
            height: 30,
            padding: 0,
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        {/* Display of the current quantity with manual input */}
        <TextField
          value={count}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{
            width: 40,
            '& input': {
              textAlign: 'center',
              padding: '2px',
            },
          }}
        />

        {/* Button to increment quantity */}
        <IconButton
          onClick={handleIncrement}
          color="primary"
          sx={{
            borderRadius: 1,
            width: 15,
            height: 30,
            padding: 0,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Button to add to cart */}
      <IconButton
        color="primary"
        sx={{
          borderRadius: 2,
          width: 20,
          height: 30,
          marginLeft: 0.25,
        }}
      >
        <ShoppingCartIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const Cart = () => {
  return (
    <div>
      <Typography>Тут будет корзина</Typography>
      <QuantitySelector />
    </div>
  );
};
