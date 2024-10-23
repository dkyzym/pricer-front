import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material';

export const SupplierStatusIndicator = ({
  supplier,
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
              onChange={() => onChange(supplier)}
              color="primary"
            />
          }
          label={supplier}
        />
        {/* <Typography variant="subtitle1" fontWeight="bold">
          {supplier}:
        </Typography> */}
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
    </FormGroup>
  );
};
