import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { MaxDeadlineSelector } from '../MaxDeadlineSelector/MaxDeadlineSelector';

export const FilterControls = ({
  maxDeadline,
  setMaxDeadline,
  maxDeliveryDate,
  setMaxDeliveryDate,
  maxPrice,
  setMaxPrice,
  minQuantity,
  setMinQuantity,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <MaxDeadlineSelector value={maxDeadline} onChange={setMaxDeadline} />
        <DatePicker
          label="Максимальная дата"
          value={maxDeliveryDate}
          onChange={setMaxDeliveryDate}
          slotProps={{ field: { clearable: true } }}
          disablePast
          sx={{
            ...(maxDeliveryDate && {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '2px solid green',
                },
              },
            }),
          }}
        />
        <TextField
          label="Максимальная цена"
          variant="outlined"
          value={maxPrice}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
              setMaxPrice(value);
            }
          }}
          type="number"
          inputProps={{ min: 0 }}
          sx={{
            ...(maxPrice !== '' && {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '2px solid green',
                },
              },
            }),
          }}
        />
        <TextField
          label="Минимальное количество"
          variant="outlined"
          value={minQuantity}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
              setMinQuantity(value);
            }
          }}
          type="number"
          inputProps={{ min: 0 }}
          sx={{
            ...(minQuantity !== '' && {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: '2px solid green',
                },
              },
            }),
          }}
        />
      </div>
    </LocalizationProvider>
  );
};
