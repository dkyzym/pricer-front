import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

export const SupplierStatusIndicator = ({
  supplierKey,
  status,
  checked,
  onChange,
}) => {
  return (
    <FormGroup>
      <Stack direction="row" alignItems="center" spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={() => onChange(supplierKey)}
              color="primary"
            />
          }
          label={supplierKey}
        />

        {/* Блок фиксированной ширины, внутри - короткий индикатор */}
        <Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
          {status.loading && <CircularProgress size={16} />}
          {!status.loading && status.error && (
            <Tooltip title={status.error}>
              <ErrorOutlineIcon color="error" />
            </Tooltip>
          )}
          {!status.loading && !status.error && (
            <Typography>{status.results.data?.length}</Typography>
          )}
        </Box>
      </Stack>
    </FormGroup>
  );
};
