import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
];

export const MaxDeadlineSelector = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  // Синхронизируем inputValue с value
  useEffect(() => {
    setInputValue(value !== '' ? String(value) : '');
  }, [value]);

  const handleInputChange = (_event, newInputValue) => {
    // Позволяем пустую строку
    if (newInputValue === '') {
      setInputValue('');
      onChange('');
      return;
    }

    // Проверяем, что введено число
    const numericValue = Number(newInputValue);

    // Проверяем, что число целое и неотрицательное
    if (Number.isInteger(numericValue) && numericValue >= 0) {
      setInputValue(String(numericValue));
      onChange(numericValue);
    } else {
      toast.warn('Вчерашний день выберем позавчера');
    }
  };

  return (
    <Autocomplete
      sx={{ width: 150 }}
      freeSolo
      options={options}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Макс. (дни)"
          variant="outlined"
          type="number"
          inputProps={{
            ...params.inputProps,
            min: 0,
            step: 1,
          }}
          sx={{
            ...(inputValue !== '' && {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '2px solid green',
                },
              },
            }),
          }}
        />
      )}
    />
  );
};
