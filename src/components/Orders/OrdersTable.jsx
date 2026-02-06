import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Chip, Paper, Typography, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { supplierNameMap } from '../../constants/constants'; // Убедись, что путь верен

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

export const OrdersTable = () => {
  const items = useSelector((state) => state.orders.items);
  const { searchQuery, statusFilter } = useSelector(
    (state) => state.orders.filters
  );
  const status = useSelector((state) => state.orders.status);

  const filteredRows = useMemo(() => {
    // Если items null/undefined, вернуть пустой массив, чтобы не упал .filter
    if (!items || !Array.isArray(items)) return [];

    const q = (searchQuery || '').trim().toLowerCase();

    return items.filter((item) => {
      // 1. Фильтрация по строке поиска
      let matchesSearch = true;
      if (q) {
        const orderId = (item.orderId || '').toString().toLowerCase();
        const name = (item.name || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const article = (item.article || '').toLowerCase();
        const supplier = (item.supplier || '').toLowerCase();
        const comment = (item.comment || '').toLowerCase();

        matchesSearch =
          orderId.includes(q) ||
          name.includes(q) ||
          brand.includes(q) ||
          article.includes(q) ||
          supplier.includes(q) ||
          comment.includes(q);
      }

      // 2. Фильтрация по статусу
      let matchesStatus = true;
      if (statusFilter && statusFilter.length > 0) {
        matchesStatus = statusFilter.includes(item.status);
      }

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const columns = useMemo(
    () => [
      {
        field: 'supplier',
        headerName: 'Пост.', // Сократили
        width: 80,
        renderCell: (params) => {
          const code = params.value;
          // Пытаемся найти красивое имя или берем код и апперкейсим
          const label = supplierNameMap[code] || (code || '').toUpperCase();
          return (
            <Typography variant="caption" fontWeight="bold">
              {label}
            </Typography>
          );
        },
      },
      {
        field: 'orderId',
        headerName: '№ Заказа',
        width: 100,
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
        width: 120,
      },
      {
        field: 'name',
        headerName: 'Наименование',
        width: 220, // Фиксированная, уменьшенная ширина
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
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
        flex: 1, // Занимает всё оставшееся место
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
            <Chip
              label={statusRaw}
              size="small"
              color={mapStatusToColor(statusKey)}
              variant={statusKey === 'refused' ? 'filled' : 'outlined'}
              sx={{ maxWidth: '100%' }}
            />
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
        <Typography variant="body2" color="text.secondary">
          Показано: {filteredRows.length} из {items?.length || 0}
        </Typography>
        <Typography variant="h6" color="primary">
          Итого: {totalSum.toLocaleString('ru-RU')} ₽
        </Typography>
      </Box>
    </Paper>
  );
};
