import { CopiableCell } from '@components/Columns/CopiableData';
import { Box, Chip, Paper, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { supplierNameMap } from '../../constants/constants';

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const pad = (n) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const mapStatusToColor = (status) => {
  switch (status) {
    case 'finished':
      return 'success';
    case 'refused':
      return 'error';
    case 'shipping':
      return 'info';
    case 'work':
      return 'warning';
    case 'ready':
      return 'success';
    case 'pending':
    default:
      return 'default';
  }
};

const getValueFromArgs = (args) => {
  const first = args?.[0];
  if (first && typeof first === 'object' && 'value' in first)
    return first.value;
  return first;
};

const getRowFromArgs = (args) => {
  const first = args?.[0];
  const second = args?.[1];
  if (first && typeof first === 'object' && 'row' in first) return first.row;
  if (second && typeof second === 'object') return second;
  return undefined;
};

// Функция нормализации строки: приводит к нижнему регистру и удаляет всё, кроме букв и цифр
const normalizeStr = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]/gi, '');

export const OrdersTable = () => {
  const items = useSelector((state) => state.orders.items);
  const {
    searchQuery,
    statusFilter,
    hiddenSuppliers = [],
  } = useSelector((state) => state.orders.filters);
  const status = useSelector((state) => state.orders.status);

  // Локальное состояние для фиксации времени последнего успешного обновления
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (status === 'succeeded') {
      setLastUpdated(new Date());
    }
  }, [status]);

  const filteredRows = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    // Подготовка поискового запроса: разбиваем на части по пробелам и нормализуем каждую часть
    const queryParts = (searchQuery || '')
      .trim()
      .split(/\s+/)
      .map(normalizeStr)
      .filter((part) => part.length > 0);

    return items.filter((item) => {
      // 1. Фильтрация по статусу
      if (statusFilter && statusFilter.length > 0) {
        if (!statusFilter.includes(item.status)) return false;
      }

      // 1.5 Фильтрация скрытых поставщиков
      if (hiddenSuppliers && hiddenSuppliers.includes(item.supplier)) {
        return false;
      }

      // 2. Умный поиск
      if (queryParts.length > 0) {
        const searchableRaw = `
          ${item.orderId || ''} 
          ${item.name || ''} 
          ${item.brand || ''} 
          ${item.article || ''} 
          ${item.supplier || ''} 
          ${item.comment || ''}
        `;
        const normalizedTarget = normalizeStr(searchableRaw);

        const matchesSearch = queryParts.every((part) =>
          normalizedTarget.includes(part)
        );

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [items, searchQuery, statusFilter, hiddenSuppliers]);

  const columns = useMemo(
    () => [
      {
        field: 'supplier',
        headerName: 'Пост.',
        width: 80,
        renderCell: (params) => {
          const code = params.value;
          const label = supplierNameMap[code] || (code || '').toUpperCase();
          return (
            <Tooltip title={label}>
              <Typography variant="caption" fontWeight="bold">
                {label}
              </Typography>
            </Tooltip>
          );
        },
      },
      {
        field: 'orderId',
        headerName: '№ Заказа',
        width: 100,
        renderCell: (params) => <CopiableCell value={params.value} />,
      },
      {
        field: 'createdAt',
        headerName: 'Дата',
        width: 130,
        valueFormatter: (...args) => formatDateTime(getValueFromArgs(args)),
      },
      {
        field: 'brand',
        headerName: 'Бренд',
        width: 110,
      },
      {
        field: 'article',
        headerName: 'Артикул',
        width: 150,
        renderCell: (params) => <CopiableCell value={params.value} />,
      },
      {
        field: 'name',
        headerName: 'Наименование',
        flex: 1,
        width: 220,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                display: 'block',
              }}
            >
              {params.value}
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'comment',
        headerName: 'Комментарий',
        minWidth: 150,
        renderCell: (params) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: 'Статус',
        width: 140,
        renderCell: (params) => {
          const row = params?.row;
          const statusKey = row?.status;
          const statusRaw = row?.statusRaw || statusKey || '';

          return (
            <Tooltip title={statusRaw} placement="left">
              <Chip
                label={statusRaw}
                size="small"
                color={mapStatusToColor(statusKey)}
                variant={statusKey === 'refused' ? 'filled' : 'outlined'}
                sx={{ maxWidth: '100%' }}
              />
            </Tooltip>
          );
        },
        sortable: false,
      },
      {
        field: 'price',
        headerName: 'Цена',
        width: 100,
        valueFormatter: (...args) => {
          const value = Number(getValueFromArgs(args) || 0);
          return `${value.toLocaleString('ru-RU')} ₽`;
        },
      },
      {
        field: 'quantity',
        headerName: 'Шт.',
        width: 60,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'total',
        headerName: 'Сумма',
        width: 110,
        valueGetter: (...args) => {
          const row = getRowFromArgs(args);
          if (row.totalPrice != null) return row.totalPrice;
          return Number(row.price || 0) * Number(row.quantity || 0);
        },
        valueFormatter: (...args) => {
          const value = Number(getValueFromArgs(args) || 0);
          return `${value.toLocaleString('ru-RU')} ₽`;
        },
      },
    ],
    []
  );

  const totalSum = useMemo(() => {
    return filteredRows.reduce((acc, item) => {
      const value =
        item.totalPrice != null
          ? Number(item.totalPrice)
          : Number(item.price || 0) * Number(item.quantity || 0);
      if (Number.isNaN(value)) return acc;
      return acc + value;
    }, 0);
  }, [filteredRows]);

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 400,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          loading={status === 'loading'}
          disableSelectionOnClick
          autoHeight={false}
          sx={{ border: 'none' }}
          localeText={{ noRowsLabel: 'Нет заказов' }}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Показано: {filteredRows.length} из {items?.length || 0}
          </Typography>
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Обновлено:{' '}
              {lastUpdated.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
        </Box>
        <Typography variant="h6" color="primary">
          Итого: {totalSum.toLocaleString('ru-RU')} ₽
        </Typography>
      </Box>
    </Paper>
  );
};
