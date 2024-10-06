import { Box, CircularProgress, Typography } from '@mui/material';

export const SupplierStatusIndicator = ({ supplier, status }) => {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {status.loading && (
        <CircularProgress size={24} style={{ marginLeft: '10px' }} />
      )}
      {!status.loading && status.error && (
        <Typography color="error" sx={{ marginLeft: '10px' }}>
          Error: {status.error}
        </Typography>
      )}
      {!status.loading && !status.error && (
        <Typography sx={{ marginLeft: '10px' }}>
          {supplier}: {status.results.length}
        </Typography>
      )}
    </Box>
  );
};
