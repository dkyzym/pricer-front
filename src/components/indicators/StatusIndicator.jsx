import { Checkbox, CircularProgress, Stack, Typography } from '@mui/material';

export const SupplierStatusIndicator = ({
  supplier,
  status,
  checked,
  onChange,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Checkbox
        checked={checked}
        onChange={() => onChange(supplier)}
        color="primary"
      />
      <Typography variant="subtitle1" fontWeight="bold">
        {supplier}:
      </Typography>
      {status.loading && <CircularProgress size={16} />}
      {!status.loading && status.error && (
        <Typography color="error" noWrap>
          Error: {status.error}
        </Typography>
      )}
      {!status.loading && !status.error && (
        <Typography>{status.results.length}</Typography>
      )}
    </Stack>
  );
};
