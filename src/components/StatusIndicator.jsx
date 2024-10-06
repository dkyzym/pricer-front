import { CircularProgress, Stack, Typography } from '@mui/material';

export const SupplierStatusIndicator = ({ supplier, status }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
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
