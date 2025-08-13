import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { greenSuppliers, supplierNameMap } from 'src/constants/constants';
import { AddToCartCell } from './AddToCartCell';
import { CopiableCell } from './CopiableCell';

const getChipColor = (difference) => {
  if (difference <= 2.3) return 'success';
  if (difference > 2.3 && difference <= 3) return 'warning';
  return 'error';
};

export const getColumns = ({
  minPrice,
  minDeadline,
  maxProbability,
  minDeliveryDate,
}) => [
  {
    field: 'brand',
    headerName: 'Брэнд',
    width: 100,
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
    cellClassName: (params) =>
      params.row.needToCheckBrand ? 'highlightBrand' : '',
  },
  {
    field: 'article',
    headerName: 'Артикул',
    width: 120,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => <CopiableCell value={params.value} />,
  },
  {
    field: 'description',
    headerName: 'Описание',
    width: 215,
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box
        display="flex"
        alignItems="center"
        height="100%"
        width="100%"
        padding="0 8px"
      >
        {params.row.isBestOverall && (
          <StarIcon style={{ color: '#FFD700', marginRight: '5px' }} />
        )}
        {params.row.isBestPrice && !params.row.isBestOverall && (
          <AttachMoneyIcon style={{ color: 'green', marginRight: '5px' }} />
        )}
        {params.row.isFastest &&
          !params.row.isBestOverall &&
          !params.row.isBestPrice && (
            <SpeedIcon style={{ color: 'blue', marginRight: '5px' }} />
          )}
        <Tooltip title={params.value || ''} arrow>
          <Typography
            variant="body2"
            noWrap
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flexGrow: 1,
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    field: 'warehouse',
    headerName: 'Склад',
    width: 90,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'availability',
    headerName: 'Наличие',
    width: 55,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'allow_return',
    headerName: '',
    width: 30,
    disableColumnMenu: true,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    // Иконка в заголовке
    renderHeader: () => (
      <Tooltip title="Возможность возврата">
        <KeyboardReturnIcon />
      </Tooltip>
    ),
    // Иконка в ячейках (true/false) или пустая ячейка
    renderCell: (params) => {
      const allowReturn = params.value;
      if (typeof allowReturn === 'undefined') {
        return null;
      }
      const iconColor = allowReturn ? 'green' : '#f54269';
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <KeyboardReturnIcon style={{ color: iconColor }} />
        </div>
      );
    },
  },
  {
    field: 'probability',
    headerName: '%',
    width: 40,
    disableColumnMenu: true,
    cellClassName: (params) =>
      params.value === maxProbability ? 'bestProbability' : '',
  },
  {
    field: 'deadline',
    headerName: 'Ч',
    width: 20,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    cellClassName: (params) =>
      params.value === minDeadline ? 'bestDeadline' : '',
  },
  {
    field: 'deliveryDate',
    headerName: 'Доставка',
    width: 100,
    disableColumnMenu: true,
    type: 'string',
    cellClassName: (params) => {
      const dateStr = params.value;
      if (!dateStr) return '';
      let cellDate;
      if (dateStr.toLowerCase() === 'сегодня') {
        cellDate = DateTime.local().startOf('day');
      } else {
        const date = DateTime.fromISO(dateStr);
        if (!date.isValid) return '';
        cellDate = date.startOf('day');
      }
      return minDeliveryDate && cellDate.equals(minDeliveryDate)
        ? 'bestDeliveryDate'
        : '';
    },
    renderCell: (params) => {
      const dateStr = params.value;
      const today = DateTime.local().startOf('day');
      if (dateStr?.toLowerCase() === 'сегодня') return 'сегодня';
      const date = DateTime.fromISO(dateStr);
      if (!date.isValid) return dateStr;
      const diffDays = date.startOf('day').diff(today, 'days').days;
      if (diffDays === 0) return 'сегодня';
      if (diffDays === 1) return 'завтра';
      if (diffDays === 2) return 'послезавтра';
      return date.setLocale('ru').toFormat('dd LLL');
    },
  },
  {
    field: 'price',
    headerName: 'Цена',
    width: 120,
    sortable: true,
    type: 'number',
    cellClassName: (params) => (params.value === minPrice ? 'bestPrice' : ''),
    renderCell: (params) => {
      const price = Math.round(params.value);
      const difference = params.row.priceDifferencePercent;
      let diffLabel = '';
      if (typeof difference === 'number') {
        diffLabel = `${difference > 0 ? '+' : ''}${difference.toFixed(1)}%`;
      }
      return (
        // Этот Box обеспечивает вертикальное центрирование
        <Box display="flex" alignItems="center" height="100%" width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="body1">{price}</Typography>
            {typeof difference === 'number' && (
              <Tooltip title={`Насколько дороже безнал`} arrow>
                <Chip
                  label={diffLabel}
                  size="small"
                  color={getChipColor(difference)}
                  variant="outlined"
                  sx={{ ml: 0.7, height: '18px', fontSize: '0.9rem' }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'addToCart',
    headerName: 'Корзина',
    width: 130,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => <AddToCartCell {...params} />,
  },
  {
    field: 'supplier',
    headerName: 'Поставщик',
    width: 120,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const supplierCode = params.value;
      const supplierName = supplierNameMap[supplierCode] || supplierCode;
      const textColor = greenSuppliers.has(supplierCode)
        ? 'success.main'
        : 'text.primary';

      return (
        <Box display="flex" alignItems="center" height="100%" width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Tooltip title={supplierName} arrow>
              <Typography variant="body2" noWrap sx={{ color: textColor }}>
                {supplierName}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      );
    },
  },
];
