import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
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
        {status.loading && <CircularProgress size={16} />}
        {!status.loading && status.error && (
          <Typography color="error" noWrap>
            Error: {status.error}
          </Typography>
        )}
        {!status.loading && !status.error && (
          <Typography>{status.results.data?.length}</Typography>
        )}
      </Stack>
    </FormGroup>
  );
};
