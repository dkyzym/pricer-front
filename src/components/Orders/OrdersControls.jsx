import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
  Tooltip,
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
  toggleHiddenSupplier,
} from '../../redux/ordersSlice';

const ORDERS_SUPPLIERS = [
  'profit',
  'autosputnik',
  'autosputnik_bn',
  'ug',
  'ug_bn',
  'patriot',
  'npn',
  'avtodinamika',
  'mikano',
  'autoImpulse',
];

const STATUS_OPTIONS = [
  { value: 'refused', label: 'Отказ' },
  { value: 'finished', label: 'Выдано' },
  { value: 'work', label: 'В работе' },
  { value: 'shipping', label: 'В пути' },
  { value: 'ready', label: 'Готово' },
  { value: 'pending', label: 'Ожидает' },
];

const formatDate = (date) => {
  if (!date) return '';
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const OrdersControls = () => {
  const dispatch = useDispatch();

  const {
    selectedSuppliers,
    searchQuery,
    statusFilter,
    hiddenSuppliers = [],
  } = useSelector((state) => state.orders.filters);
  const status = useSelector((state) => state.orders.status);
  const items = useSelector((state) => state.orders.items);
  const meta = useSelector((state) => state.orders.meta);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const safeSelectedSuppliers = useMemo(() => {
    const raw = Array.isArray(selectedSuppliers) ? selectedSuppliers : [];
    return raw.filter((s) => ORDERS_SUPPLIERS.includes(s));
  }, [selectedSuppliers]);

  // Вычисляем количество и самую старую дату за один проход
  const statsBySupplier = useMemo(() => {
    const map = new Map();
    for (const key of ORDERS_SUPPLIERS)
      map.set(key, { count: 0, oldestDate: null });

    for (const item of items || []) {
      const key = item?.supplier;
      if (!key || !map.has(key)) continue;

      const stats = map.get(key);
      stats.count += 1;

      if (item.createdAt) {
        const itemDate = new Date(item.createdAt);
        if (!Number.isNaN(itemDate.getTime())) {
          if (!stats.oldestDate || itemDate < stats.oldestDate) {
            stats.oldestDate = itemDate;
          }
        }
      }
    }
    return map;
  }, [items]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isLoading = status === 'loading';
  const isSucceeded = status === 'succeeded';

  const hasPartialErrors =
    isSucceeded && (meta?.failedSuppliers?.length || 0) > 0;
  const isFullySuccessful =
    isSucceeded && (meta?.failedSuppliers?.length || 0) === 0;
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

  const handleToggleHideChip = (key) => {
    dispatch(toggleHiddenSupplier(key));
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
          {/* Кнопка Меню Поставщиков */}
          <Box>
            <Button
              id="orders-suppliers-button"
              variant="outlined"
              onClick={handleClick}
              disabled={isLoading}
              startIcon={
                hasPartialErrors ? (
                  <WarningAmberIcon color="warning" />
                ) : isFullySuccessful ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <FilterListIcon />
                )
              }
              endIcon={<KeyboardArrowDownIcon />}
              color={hasPartialErrors ? 'warning' : 'primary'}
            >
              Выбор поставщиков
            </Button>
            <Menu
              id="orders-suppliers-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  sx: { maxHeight: 420, width: '300px' },
                },
              }}
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
              {ORDERS_SUPPLIERS.map((key) => {
                const isFailed =
                  isSucceeded &&
                  meta?.failedSuppliers?.some((f) => f.name === key);
                const stats = statsBySupplier.get(key) || { count: 0 };
                return (
                  <MenuItem key={key} onClick={() => handleToggleSupplier(key)}>
                    <Checkbox checked={safeSelectedSuppliers.includes(key)} />
                    <ListItemText
                      primary={supplierNameMap[key] || key.toUpperCase()}
                      sx={{ color: isFailed ? 'error.main' : 'inherit' }}
                    />
                    <Typography
                      variant="caption"
                      color={isFailed ? 'error.main' : 'text.secondary'}
                    >
                      {isFailed ? 'Ошибка' : stats.count}
                    </Typography>
                  </MenuItem>
                );
              })}
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
            placeholder="ID, бренд, артикул (игнор. символы)..."
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

        {/* 2. Панель активных чипов с визуализацией успеха/ошибок и скрытия */}
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

            {safeSelectedSuppliers.map((key) => {
              const failedInfo = meta?.failedSuppliers?.find(
                (f) => f.name === key
              );
              const stats = statsBySupplier.get(key) || {
                count: 0,
                oldestDate: null,
              };
              const isHidden = hiddenSuppliers.includes(key);

              let chipColor = 'primary';
              let chipVariant = 'outlined';
              let tooltipContent = null;

              // Логика сборки контента для тултипа
              if (isSucceeded) {
                if (failedInfo) {
                  chipColor = 'error';
                  chipVariant = 'filled';
                  tooltipContent = (
                    <Typography variant="body2">
                      Ошибка парсинга: {failedInfo.reason}
                    </Typography>
                  );
                } else if (stats.count > 0) {
                  chipColor = 'success';
                  chipVariant = 'filled';
                  tooltipContent = (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight="bold">
                        Успешно загружено: {stats.count} шт.
                      </Typography>
                      {stats.oldestDate && (
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            display: 'block',
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          Самый старый: {formatDate(stats.oldestDate)}
                        </Typography>
                      )}
                    </Box>
                  );
                } else {
                  chipColor = 'default';
                  chipVariant = 'outlined';
                  tooltipContent = (
                    <Typography variant="body2">Заказов не найдено</Typography>
                  );
                }
              }

              // Если скрыт, добавляем пометку в тултип
              if (isHidden && tooltipContent) {
                tooltipContent = (
                  <Box>
                    {tooltipContent}
                    <Divider
                      sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }}
                    />
                    <Typography variant="caption" color="warning.light">
                      Нажмите, чтобы показать в таблице
                    </Typography>
                  </Box>
                );
              }

              const chipElement = (
                <Chip
                  key={key}
                  label={supplierNameMap[key] || key.toUpperCase()}
                  onDelete={() => handleDeleteChip(key)}
                  onClick={() => handleToggleHideChip(key)}
                  color={chipColor}
                  variant={chipVariant}
                  size="small"
                  sx={{
                    // UX/UI: Четкая обратная связь, что элемент скрыт
                    opacity: isHidden ? 0.4 : 1,
                    textDecoration: isHidden ? 'line-through' : 'none',
                    filter: isHidden ? 'grayscale(100%)' : 'none',
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              );

              return tooltipContent ? (
                <Tooltip key={key} title={tooltipContent} placement="top" arrow>
                  {chipElement}
                </Tooltip>
              ) : (
                chipElement
              );
            })}

            {safeSelectedSuppliers.length > 1 && (
              <Chip
                label="Очистить все"
                onClick={() => dispatch(setSelectedSuppliers([]))}
                size="small"
                variant="filled"
                color="default"
                sx={{ cursor: 'pointer', ml: 1 }}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
