import { SupplierSelectMenu } from '@components/indicators/SupplierSelectMenu';
import { FilterControls } from '@components/search/FilterControls/FilterControls';
import { Box } from '@mui/material';

export const ActionBar = ({
  supplierStatus,
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'nowrap',
      }}
    >
      <SupplierSelectMenu
        supplierStatus={supplierStatus}
        // Убрали передачу пропсов, теперь компонент сам берет данные из Redux
      />
      <FilterControls
        maxDeadline={maxDeadline}
        setMaxDeadline={setMaxDeadline}
        maxDeliveryDate={maxDeliveryDate}
        setMaxDeliveryDate={setMaxDeliveryDate}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minQuantity={minQuantity}
        setMinQuantity={setMinQuantity}
      />
    </Box>
  );
};
