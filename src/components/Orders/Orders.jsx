import { Box } from '@mui/material';
import { OrdersControls } from './OrdersControls';
import { OrdersTable } from './OrdersTable';

export const Orders = () => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <OrdersControls />
      <Box sx={{ flexGrow: 1, minHeight: 400 }}>
        <OrdersTable />
      </Box>
    </Box>
  );
};

