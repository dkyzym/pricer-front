import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supplierNameMap } from 'src/constants/constants';
import {
  clearAllSuppliersSelected,
  setAllSuppliersSelected,
  toggleSupplierSelection,
} from 'src/redux/supplierSlice';

export const SupplierSelectMenu = ({ supplierStatus }) => {
  const dispatch = useDispatch();

  // Берем список выбранных поставщиков из Redux
  const selectedSuppliers = useSelector(
    (state) => state.supplier.selectedSuppliers
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [wasLoading, setWasLoading] = useState(false);

  const isAnyLoading = Object.values(supplierStatus).some(
    (status) => status.loading
  );
  const suppliersWithErrors = Object.entries(supplierStatus)
    .filter(([, status]) => !status.loading && !!status.error)
    .map(([key]) => supplierNameMap[key] || key);
  const hasErrors = suppliersWithErrors.length > 0;

  useEffect(() => {
    if (isAnyLoading) {
      setWasLoading(true);
    }
  }, [isAnyLoading]);

  const showSuccessIcon = wasLoading && !isAnyLoading && !hasErrors;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const allSuppliersCount = Object.keys(supplierStatus).length;
  // Проверяем, выбраны ли все (сравнение длины массивов - простой и быстрый способ)
  const isAllSelected = selectedSuppliers.length === allSuppliersCount;

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      dispatch(clearAllSuppliersSelected());
    } else {
      dispatch(setAllSuppliersSelected());
    }
  };

  const handleToggleSupplier = (key) => {
    dispatch(toggleSupplierSelection(key));
  };

  return (
    <Box>
      <Tooltip
        arrow
        title={
          isAnyLoading
            ? 'Идет обновление статусов...'
            : hasErrors
              ? `Ошибка у поставщиков: ${suppliersWithErrors.join(', ')}`
              : showSuccessIcon
                ? 'Статусы успешно обновлены'
                : ''
        }
      >
        <span>
          <Button
            id="supplier-select-button"
            aria-controls={open ? 'supplier-select-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="outlined"
            onClick={handleClick}
            disabled={isAnyLoading}
            color="primary"
            startIcon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isAnyLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : hasErrors ? (
                  <ErrorOutlineIcon color="error" />
                ) : showSuccessIcon ? (
                  <CheckCircleIcon color="success" />
                ) : null}
              </Box>
            }
            endIcon={<KeyboardArrowDownIcon />}
          >
            Поставщики ({selectedSuppliers.length} / {allSuppliersCount})
          </Button>
        </span>
      </Tooltip>
      <Menu
        id="supplier-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'supplier-select-button',
        }}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '30ch',
          },
        }}
      >
        <MenuItem onClick={handleSelectAllToggle}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={selectedSuppliers.length > 0 && !isAllSelected}
          />
          <Typography>
            {isAllSelected ? 'Снять со всех' : 'Выбрать всех'}
          </Typography>
        </MenuItem>
        <Divider />
        {Object.entries(supplierStatus).map(([supplierKey, status]) => (
          <MenuItem
            key={supplierKey}
            onClick={() => handleToggleSupplier(supplierKey)}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ width: '100%' }}
            >
              <Checkbox checked={selectedSuppliers.includes(supplierKey)} />
              <Typography sx={{ flexGrow: 1 }}>
                {supplierNameMap[supplierKey] || supplierKey}
              </Typography>

              <Box
                sx={{
                  width: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {status.loading && <CircularProgress size={16} />}
                {!status.loading && status.error && (
                  <Tooltip title={status.error} arrow>
                    <ErrorOutlineIcon color="error" fontSize="small" />
                  </Tooltip>
                )}
                {!status.loading && !status.error && (
                  <Typography variant="body2" color="text.secondary">
                    {status.results.data?.length || 0}
                  </Typography>
                )}
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
