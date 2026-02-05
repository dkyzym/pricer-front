import axiosInstance from '@api/axiosInstance';
import { API_URL } from '@api/config';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Запрашиваем данные.
        // Axios сам парсит JSON, поэтому данные лежат в response.data
        const response = await axiosInstance.get(`${API_URL}/api/orders`);

        console.log('Пришли заказы:', response.data); // Смотри в консоль браузера!
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Ошибка получения заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Пустой массив = вызов один раз при старте

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Тестовый вывод заказов
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map((item) => (
          <Paper
            key={item.id}
            style={{
              padding: 15,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                {item.supplier.toUpperCase()} | {item.brand} - {item.article}
              </Typography>
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="caption">
                ID: {item.id} | Date: {item.createdAt || 'N/A'}
              </Typography>
            </Box>

            <Box style={{ textAlign: 'right' }}>
              <Typography variant="h6">
                {item.price} ₽ x {item.quantity} шт.
              </Typography>
              <Chip
                label={item.statusRaw} // Показываем то, что прислал поставщик (человекопонятно)
                color={
                  item.status === 'finished'
                    ? 'success'
                    : item.status === 'refused'
                      ? 'error'
                      : 'primary'
                }
                size="small"
              />
              <div style={{ fontSize: '10px', marginTop: 5 }}>
                Internal: {item.status}
              </div>
            </Box>
          </Paper>
        ))}
      </div>

      {/* Для отладки: вывод сырого JSON, если список пуст или странный */}
      <details style={{ marginTop: 20 }}>
        <summary>Сырой JSON (для отладки)</summary>
        <pre style={{ background: '#f0f0f0', padding: 10, borderRadius: 5 }}>
          {JSON.stringify(orders, null, 2)}
        </pre>
      </details>
    </div>
  );
};
