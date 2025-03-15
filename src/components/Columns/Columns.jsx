import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import { Box, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { AddToCartCell } from './AddToCartCell';
import { CopiableCell } from './CopiableCell';

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
    width: 220,
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
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'availability',
    headerName: 'Наличие',
    width: 60,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'allow_return',
    headerName: '',
    width: 50,
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
    width: 110,
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
    width: 100,
    disableColumnMenu: true,
    cellClassName: (params) => (params.value === minPrice ? 'bestPrice' : ''),
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
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];
