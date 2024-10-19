import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import { TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { MaxDeadlineSelector } from './MaxDeadlineSelector/MaxDeadlineSelector';
import { customStyles } from './styles/searchResultsTableStyles';

export const ResultsTable = ({ allResults }) => {
  const [maxDeadline, setMaxDeadline] = useState('');
  const [maxDeliveryDate, setMaxDeliveryDate] = useState(null);

  const [maxPrice, setMaxPrice] = useState('');
  const [sortModel, setSortModel] = useState([{ field: 'price', sort: 'asc' }]);

  // Обновляем функцию фильтрации данных
  const filteredData = useMemo(() => {
    const now = DateTime.now();

    return allResults.filter((item) => {
      const deliveryDate = DateTime.fromISO(item.deliveryDate);

      if (!deliveryDate.isValid) {
        return false;
      }

      const daysUntilDelivery = deliveryDate.diff(now, 'days').days;

      let isDeadlineValid = true;

      if (maxDeliveryDate) {
        // Если задана максимальная дата доставки, используем её
        isDeadlineValid = deliveryDate <= maxDeliveryDate.endOf('day');
      } else if (maxDeadline !== '' && !isNaN(maxDeadline)) {
        // Иначе используем максимальный срок доставки в днях
        isDeadlineValid = daysUntilDelivery <= parseFloat(maxDeadline);
      }

      const isPriceValid =
        maxPrice === '' ||
        isNaN(maxPrice) ||
        item.price <= parseFloat(maxPrice);

      return isDeadlineValid && isPriceValid;
    });
  }, [allResults, maxDeadline, maxDeliveryDate, maxPrice]);

  const minDaysUntilDelivery = useMemo(() => {
    const now = DateTime.now();

    return Math.min(
      ...filteredData.map((item) => {
        const deliveryDate = DateTime.fromISO(item.deliveryDate);
        if (!deliveryDate.isValid) {
          return Infinity;
        }
        return deliveryDate.diff(now, 'days').days;
      })
    );
  }, [filteredData]);

  // Находим минимальные и максимальные значения для условного форматирования
  const minPrice = useMemo(() => {
    return Math.min(...filteredData.map((item) => item.price));
  }, [filteredData]);

  const minDeadline = useMemo(() => {
    return Math.min(...filteredData.map((item) => item.deadline));
  }, [filteredData]);

  const maxProbability = useMemo(() => {
    return Math.max(
      ...filteredData
        .filter((item) => item.probability !== '')
        .map((item) => item.probability)
    );
  }, [filteredData]);

  const minDeliveryDate = useMemo(() => {
    return filteredData.reduce((minDate, item) => {
      const deliveryDate = DateTime.fromISO(item.deliveryDate);
      if (!deliveryDate.isValid) {
        return minDate;
      }
      return deliveryDate < minDate ? deliveryDate : minDate;
    }, DateTime.fromISO('9999-12-31'));
  }, [filteredData]);

  // Добавляем флаги для иконок
  const enrichedData = useMemo(() => {
    return filteredData.map((item) => {
      const deliveryDate = DateTime.fromISO(item.deliveryDate);

      return {
        ...item,
        isBestPrice: item.price === minPrice,
        isFastest: deliveryDate.hasSame(minDeliveryDate, 'day'),
        isBestOverall:
          item.price === minPrice &&
          deliveryDate.hasSame(minDeliveryDate, 'day'),
      };
    });
  }, [filteredData, minPrice, minDeliveryDate]);

  // Определение столбцов с условным форматированием и иконками
  const columns = [
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
    { field: 'availability', headerName: 'Наличие', width: 90 },
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

    { field: 'supplier', headerName: 'Поставщик', width: 100 },
  ];

  return (
    <div>
      {/* Поля для ввода максимального срока и цены */}
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
          <MaxDeadlineSelector
            value={maxDeadline}
            onChange={(newValue) => setMaxDeadline(newValue)}
          />
          <DatePicker
            label="Максимальная дата"
            value={maxDeliveryDate}
            onChange={(newValue) => setMaxDeliveryDate(newValue)}
            slotProps={{ field: { clearable: true } }}
          />
          <TextField
            label="Максимальная цена"
            variant="outlined"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
          />
        </div>
      </LocalizationProvider>

      {/* Таблица с результатами */}
      <div
        style={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <DataGrid
          rows={enrichedData}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50]}
          getRowClassName={() => 'dataGridRow'}
          sx={customStyles}
          sortingOrder={['desc', 'asc']}
          sortModel={sortModel}
          onSortModelChange={(newModel) => setSortModel(newModel)}
          ignoreValueFormatterDuringExport
          filterMode="client"
          disableSelectionOnClick
          autoHeight
          localeText={{
            noRowsLabel: 'Тут пока ничего нет',
          }}
        />
      </div>
    </div>
  );
};
