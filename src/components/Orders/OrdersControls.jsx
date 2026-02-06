import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supplierNameMap } from '../../constants/constants';
import {
  fetchOrders,
  setSearchQuery,
  setSelectedSuppliers,
  setStatusFilter,
} from '../../redux/ordersSlice';

// Жесткий список поставщиков (бизнес-логика: работаем только с этими)
const ORDERS_SUPPLIERS = [
  'profit',
  'autosputnik',
  'autosputnik_bn',
  'ug',
  'ug_bn',
  'patriot',
  'npn',
  'avtodinamika',
];

const STATUS_OPTIONS = [
  { value: 'refused', label: 'Отказ' },
  { value: 'finished', label: 'Выдано' },
  { value: 'work', label: 'В работе' },
  { value: 'shipping', label: 'В пути' },
  { value: 'ready', label: 'Готово' },
  { value: 'pending', label: 'Ожидает' },
];

export const OrdersControls = () => {
  const dispatch = useDispatch();

  const { selectedSuppliers, searchQuery, statusFilter } = useSelector(
    (state) => state.orders.filters
  );
  const status = useSelector((state) => state.orders.status);
  const items = useSelector((state) => state.orders.items);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [wasLoading, setWasLoading] = useState(false);

  const safeSelectedSuppliers = useMemo(() => {
    const raw = Array.isArray(selectedSuppliers) ? selectedSuppliers : [];
    return raw.filter((s) => ORDERS_SUPPLIERS.includes(s));
  }, [selectedSuppliers]);

  // Считаем количество заказов, чтобы отобразить в меню
  const countsBySupplier = useMemo(() => {
    const map = new Map();
    for (const key of ORDERS_SUPPLIERS) map.set(key, 0);
    for (const item of items || []) {
      const key = item?.supplier;
      if (!key) continue;
      if (!map.has(key)) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [items]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isLoading = status === 'loading';
  const hasError = status === 'failed';

  if (isLoading && !wasLoading) setWasLoading(true);
  const showSuccessIcon = wasLoading && !isLoading && !hasError;

  const isAllSelected =
    safeSelectedSuppliers.length === ORDERS_SUPPLIERS.length;

  const handleSelectAllToggle = () => {
    dispatch(setSelectedSuppliers(isAllSelected ? [] : [...ORDERS_SUPPLIERS]));
  };

  const handleToggleSupplier = (key) => {
    const exists = safeSelectedSuppliers.includes(key);
    const next = exists
      ? safeSelectedSuppliers.filter((s) => s !== key)
      : [...safeSelectedSuppliers, key];
    dispatch(setSelectedSuppliers(next));
  };

  const handleDeleteChip = (key) => {
    const next = safeSelectedSuppliers.filter((s) => s !== key);
    dispatch(setSelectedSuppliers(next));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleStatusChange = (event) => {
    const {
      target: { value },
    } = event;
    const newVal = typeof value === 'string' ? value.split(',') : value;
    dispatch(setStatusFilter(newVal));
  };

  const handleRefresh = () => {
    dispatch(fetchOrders(safeSelectedSuppliers));
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 1. Верхняя панель управления */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems="center"
        >
          {/* Кнопка Меню Поставщиков (для массового выбора) */}
          <Box>
            <Button
              id="orders-suppliers-button"
              variant="outlined"
              onClick={handleClick}
              disabled={isLoading}
              startIcon={
                showSuccessIcon ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <FilterListIcon />
                )
              }
              endIcon={<KeyboardArrowDownIcon />}
            >
              Выбор поставщиков
            </Button>
            <Menu
              id="orders-suppliers-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{ style: { maxHeight: 420, width: '300px' } }}
            >
              <MenuItem onClick={handleSelectAllToggle}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={
                    safeSelectedSuppliers.length > 0 && !isAllSelected
                  }
                />
                <ListItemText
                  primary={isAllSelected ? 'Снять все' : 'Выбрать все'}
                />
              </MenuItem>
              <Divider />
              {ORDERS_SUPPLIERS.map((key) => (
                <MenuItem key={key} onClick={() => handleToggleSupplier(key)}>
                  <Checkbox checked={safeSelectedSuppliers.includes(key)} />
                  <ListItemText
                    primary={supplierNameMap[key] || key.toUpperCase()}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {countsBySupplier.get(key) || 0}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', md: 'block' } }}
          />

          {/* Фильтр по статусу */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              multiple
              value={statusFilter}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Статус" />}
              renderValue={(selected) => {
                if (selected.length === 0) return 'Все статусы';
                return selected
                  .map(
                    (val) =>
                      STATUS_OPTIONS.find((o) => o.value === val)?.label || val
                  )
                  .join(', ');
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={statusFilter.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Поиск */}
          <TextField
            sx={{ flexGrow: 1 }}
            size="small"
            label="Поиск"
            placeholder="ID, бренд, артикул, название, коммент..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* Главная кнопка Обновить */}
          <Button
            variant="contained"
            onClick={handleRefresh}
            disabled={isLoading || safeSelectedSuppliers.length === 0}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RefreshIcon />
              )
            }
            sx={{ minWidth: '130px' }}
          >
            {isLoading ? 'Загрузка...' : 'Обновить'}
          </Button>
        </Stack>

        {/* 2. Панель активных чипов (для наглядности и быстрого удаления) */}
        {safeSelectedSuppliers.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Выбрано:
            </Typography>
            {safeSelectedSuppliers.map((key) => (
              <Chip
                key={key}
                label={supplierNameMap[key] || key.toUpperCase()}
                onDelete={() => handleDeleteChip(key)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            {safeSelectedSuppliers.length > 1 && (
              <Chip
                label="Очистить все"
                onClick={() => dispatch(setSelectedSuppliers([]))}
                size="small"
                variant="filled"
                color="default"
                sx={{ cursor: 'pointer' }}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
