import { API_URL } from '@api/config';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { stripAnsi } from '@utils/ansiRegex';
import { colorByLevel, colorByUser } from '@utils/colorMaps';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { toast } from 'react-toastify';

// 1. ВЫНОСИМ КОМПОНЕНТ НАРУЖУ
// DataGrid будет стабильно его рендерить и обновлять пропсы
const CustomFooter = ({ searchCount, ...other }) => {
  return (
    <GridFooterContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
      }}
    >
      <div style={{ marginLeft: 16 }}>
        {/* Если searchCount пустой, покажем 0 */}
        <strong>Search count (GET_ITEM_RESULTS): </strong>
        {searchCount || '0'}
      </div>

      <GridPagination {...other} />
    </GridFooterContainer>
  );
};

export const HistoryLogs = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [dateValue, setDateValue] = useState(DateTime.now());

  // Фильтры
  const [levelFilter, setLevelFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [articleFilter, setArticleFilter] = useState('');

  const [loading, setLoading] = useState(false);
  const [searchCounts, setSearchCounts] = useState({});

  const fetchLogs = async () => {
    if (!dateValue) return;
    const dateStr = dateValue.toFormat('yyyy-MM-dd');

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/logs?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawLogs = res.data.logs || [];

      const cleanLogs = rawLogs.map((l, idx) => ({
        id: idx,
        ...l,
        message: stripAnsi(l.message),
        stack: l.stack ? stripAnsi(l.stack) : null,
      }));

      // ========== Подсчёт ==========
      const userSearchCounts = {};
      // const prevSearch = {};

      cleanLogs.forEach((log) => {
        if (log.message?.includes('[Global Search]')) {
          const currentUser = log.user || 'unknown';

          // Просто инкрементим. Никаких проверок времени, никаких prevSearch.
          if (!userSearchCounts[currentUser]) {
            userSearchCounts[currentUser] = 0;
          }
          userSearchCounts[currentUser]++;
        }
      });

      setSearchCounts(userSearchCounts);
      // Сначала посчитали, потом перевернули для отображения (reverse мутирует массив!)
      setLogs([...cleanLogs].reverse());
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Error loading logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (levelFilter && l.level !== levelFilter) return false;
    if (userFilter && l.user !== userFilter) return false;
    if (
      articleFilter &&
      !(l.message || '').toLowerCase().includes(articleFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getRowHeight = () => 'auto';

  const columns = [
    { field: 'timestamp', headerName: 'Time', flex: 1 },
    {
      field: 'level',
      headerName: 'Level',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: colorByLevel(params.value) }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: colorByUser(params.value) }}>
          {params.value || '-'}
        </span>
      ),
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 3,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'stack',
      headerName: 'Stack Trace',
      flex: 3,
      renderCell: (params) =>
        params.value ? (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              maxWidth: '100%',
              overflow: 'auto',
              margin: 0,
            }}
          >
            {params.value}
          </pre>
        ) : (
          ''
        ),
    },
  ];

  const searchCountString = Object.entries(searchCounts)
    .map(([user, cnt]) => `${user}=${cnt}`)
    .join(', ');

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Панель управления */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            label="Select date"
            value={dateValue}
            format="yyyy-MM-dd"
            onChange={(newValue) => newValue && setDateValue(newValue)}
            slots={{ textField: TextField }}
            slotProps={{
              textField: { size: 'small', style: { maxWidth: 170 } },
            }}
          />
        </LocalizationProvider>

        <Button onClick={fetchLogs} disabled={loading} variant="contained">
          Load
        </Button>

        <FormControl size="small">
          <InputLabel>Level</InputLabel>
          <Select
            label="Level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{ width: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="info">info</MenuItem>
            <MenuItem value="warn">warn</MenuItem>
            <MenuItem value="error">error</MenuItem>
            <MenuItem value="http">http</MenuItem>
            <MenuItem value="debug">debug</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>User</InputLabel>
          <Select
            label="User"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            style={{ width: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Den">Den</MenuItem>
            <MenuItem value="Julia">Julia</MenuItem>
            <MenuItem value="Sergey">Sergey</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Article filter"
          variant="outlined"
          size="small"
          value={articleFilter}
          onChange={(e) => setArticleFilter(e.target.value)}
          style={{ maxWidth: 200 }}
        />
      </Box>

      {/* Таблица */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(80vh - 100px)',
        }}
      >
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          disableSelectionOnClick
          getRowHeight={getRowHeight}
          // Передаем CustomFooter
          slots={{ footer: CustomFooter }}
          // Передаем данные в CustomFooter
          slotProps={{ footer: { searchCount: searchCountString } }}
          pagination
        />
      </Box>
    </Box>
  );
};
