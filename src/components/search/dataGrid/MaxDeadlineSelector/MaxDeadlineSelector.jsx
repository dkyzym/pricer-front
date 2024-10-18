// MaxDeadlineSelector.jsx
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

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

  return (
    <Autocomplete
      sx={{ width: 150 }}
      freeSolo
      options={options.map((option) => option.label)}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
        // Обновляем значение при вводе пользователем
        if (newInputValue === '') {
          onChange(''); // Пустое значение означает отсутствие ограничения
        } else {
          const numericValue = parseFloat(newInputValue);
          if (!isNaN(numericValue)) {
            onChange(numericValue);
          } else {
            onChange(''); // Сбрасываем значение, если ввод некорректен
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Макс. (дни)"
          variant="outlined"
          type="number"
        />
      )}
    />
  );
};
