import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import { TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

const ResultsTable = ({ allResults }) => {
  // Состояния для максимального срока и цены
  const [maxDeadline, setMaxDeadline] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Фильтрация данных на основе максимального срока и цены
  const filteredData = useMemo(() => {
    return allResults.filter((item) => {
      const isDeadlineValid =
        maxDeadline === '' || item.deadline <= parseFloat(maxDeadline);
      const isPriceValid =
        maxPrice === '' || item.price <= parseFloat(maxPrice);
      return isDeadlineValid && isPriceValid;
    });
  }, [allResults, maxDeadline, maxPrice]);

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

  const enrichedData = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      isBestPrice: item.price === minPrice,
      isFastest: item.deadline === minDeadline,
      isBestOverall: item.price === minPrice && item.deadline === minDeadline,
    }));
  }, [filteredData, minPrice, minDeadline]);

  // Определение столбцов с условным форматированием
  const columns = [
    {
      field: 'brand',
      headerName: 'Brand',
      width: 120,
      cellClassName: (params) =>
        params.row.needToCheckBrand ? 'highlightBrand' : '',
    },
    { field: 'article', headerName: 'Article', width: 120 },
    {
      field: 'description',
      headerName: 'Описание',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <span>{params.value}</span>
        </div>
      ),
    },
    { field: 'availability', headerName: 'Наличие', width: 90 },
    { field: 'warehouse', headerName: 'Склад', width: 130 },
    {
      field: 'probability',
      headerName: 'Вероятность',
      width: 130,
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
      headerName: 'Сроки от',
      width: 80,
      cellClassName: (params) =>
        params.value === minDeadline ? 'bestDeadline' : '',
    },
    { field: 'supplier', headerName: 'Поставщик', width: 150 },
  ];

  // Настройка стилей для условного форматирования
  const customStyles = {
    '& .bestPrice': {
      backgroundColor: '#d0f0c0', // Светло-зеленый для лучшей цены
    },
    '& .bestDeadline': {
      backgroundColor: '#c0d0f0', // Светло-синий для лучшего срока
    },
    '& .bestProbability': {
      backgroundColor: '#f0d0f0', // Светло-розовый для лучшей вероятности
    },
    '& .highlightBrand': {
      backgroundColor: '#fff3cd', // Светло-желтый для брендов, требующих проверки
    },
  };

  // Опции сортировки по умолчанию
  const defaultSortModel = [
    {
      field: 'price',
      sort: 'asc',
    },
    {
      field: 'deadline',
      sort: 'asc',
    },
  ];

  return (
    <div>
      {/* Поля для ввода максимального срока и цены */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <TextField
          label="Максимальный срок (часы)"
          variant="outlined"
          value={maxDeadline}
          onChange={(e) => setMaxDeadline(e.target.value)}
          type="number"
        />
        <TextField
          label="Максимальная цена"
          variant="outlined"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          type="number"
        />
      </div>
      {/* Таблица с результатами */}
      <div
        style={{
          height: '600px',
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
          sortModel={defaultSortModel}
          filterMode="client"
          disableSelectionOnClick
          autoHeight
          localeText={{
            noRowsLabel: 'Нет доступных данных',
          }}
        />
      </div>
    </div>
  );
};

export default ResultsTable;
