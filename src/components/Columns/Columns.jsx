import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import { Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { AddToCartCell } from './AddToCartCell';

export const getColumns = ({
  minPrice,
  minDeadline,
  maxProbability,
  minDeliveryDate,
}) => {
  return [
    {
      field: 'brand',
      headerName: 'Brand',
      width: 100,
      cellClassName: (params) =>
        params.row.needToCheckBrand ? 'highlightBrand' : '',
    },
    { field: 'article', headerName: 'Article', width: 120 },
    {
      field: 'description',
      headerName: 'Описание',
      width: 230,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                flexGrow: 1,
                display: 'inline-block',
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        </div>
      ),
    },

    { field: 'warehouse', headerName: 'Склад', width: 90 },
    {
      field: 'probability',
      headerName: '%',
      width: 50,
      cellClassName: (params) =>
        params.value === maxProbability ? 'bestProbability' : '',
    },
    {
      field: 'price',
      headerName: 'Цена',
      width: 100,
      cellClassName: (params) => (params.value === minPrice ? 'bestPrice' : ''),
    },
    {
      field: 'deadline',
      headerName: 'Ч',
      width: 60,
      cellClassName: (params) =>
        params.value === minDeadline ? 'bestDeadline' : '',
    },
    {
      field: 'deliveryDate',
      headerName: 'Доставка',
      width: 120,
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

        if (minDeliveryDate && cellDate.equals(minDeliveryDate)) {
          return 'bestDeliveryDate';
        } else {
          return '';
        }
      },
      renderCell: (params) => {
        const dateStr = params.value;
        const today = DateTime.local().startOf('day');

        if (dateStr?.toLowerCase() === 'сегодня') {
          return 'сегодня';
        }

        const date = DateTime.fromISO(dateStr);

        if (!date.isValid) {
          return dateStr;
        }

        const diffDays = date.startOf('day').diff(today, 'days').days;

        if (diffDays === 0) {
          return 'сегодня';
        } else if (diffDays === 1) {
          return 'завтра';
        } else if (diffDays === 2) {
          return 'послезавтра';
        } else {
          return date.setLocale('ru').toFormat('dd LLL');
        }
      },
    },
    { field: 'availability', headerName: 'Наличие', width: 90 },
    {
      field: 'addToCart',
      headerName: 'Корзина',
      width: 85,
      sortable: false,
      filterable: false,
      renderCell: (params) => <AddToCartCell {...params} />,
    },
    { field: 'supplier', headerName: 'Поставщик', width: 75 },
  ];
};
