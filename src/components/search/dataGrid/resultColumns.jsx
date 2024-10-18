// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import SpeedIcon from '@mui/icons-material/Speed';
// import StarIcon from '@mui/icons-material/Star';

// export const columns = (maxProbability, minPrice, minDeadline) => [
//   {
//     field: 'brand',
//     headerName: 'Brand',
//     width: 120,
//     cellClassName: (params) =>
//       params.row.needToCheckBrand ? 'highlightBrand' : '',
//   },
//   { field: 'article', headerName: 'Article', width: 120 },
//   {
//     field: 'description',
//     headerName: 'Описание',
//     width: 200,
//     renderCell: (params) => (
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         {params.row.isBestOverall && (
//           <StarIcon style={{ color: '#FFD700', marginRight: '5px' }} />
//         )}
//         {params.row.isBestPrice && !params.row.isBestOverall && (
//           <AttachMoneyIcon style={{ color: 'green', marginRight: '5px' }} />
//         )}
//         {params.row.isFastest &&
//           !params.row.isBestOverall &&
//           !params.row.isBestPrice && (
//             <SpeedIcon style={{ color: 'blue', marginRight: '5px' }} />
//           )}
//         <span>{params.value}</span>
//       </div>
//     ),
//   },
//   { field: 'availability', headerName: 'Наличие', width: 90 },
//   { field: 'warehouse', headerName: 'Склад', width: 130 },
//   {
//     field: 'probability',
//     headerName: 'Вероятность',
//     width: 130,
//     cellClassName: (params) =>
//       params.value === maxProbability ? 'bestProbability' : '',
//   },
//   {
//     field: 'price',
//     headerName: 'Цена',
//     width: 100,
//     cellClassName: (params) => (params.value === minPrice ? 'bestPrice' : ''),
//   },
//   {
//     field: 'deadline',
//     headerName: 'Сроки от',
//     width: 80,
//     cellClassName: (params) =>
//       params.value === minDeadline ? 'bestDeadline' : '',
//   },
//   { field: 'supplier', headerName: 'Поставщик', width: 150 },
// ];
