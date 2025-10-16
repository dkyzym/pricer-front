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
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          maxWidth: '60%',
        }}
      >
        <MaxDeadlineSelector value={maxDeadline} onChange={setMaxDeadline} />
        <DatePicker
          label="Макс. дата"
          value={maxDeliveryDate}
          onChange={setMaxDeliveryDate}
          slotProps={{
            field: { clearable: true, size: 'small' },
          }}
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
          label="Макс. цена"
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
          size="small"
          sx={{
            // Стили для скрытия стрелок удалены, так как они теперь глобальные
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
          label="Мин.к-во"
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
          size="small"
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

