import axiosInstance from './axiosInstance';
import { API_URL } from './config';

/**
 * Fetch orders from backend.
 * @param {string[] | undefined} suppliers - array of supplier aliases.
 */
export const fetchOrdersApi = async (suppliers) => {
  const hasSuppliers =
    Array.isArray(suppliers) && suppliers.filter(Boolean).length > 0;

  const params = hasSuppliers
    ? {
        suppliers: suppliers.join(','),
      }
    : undefined;

  // Переопределяем таймаут для этого конкретного тяжелого запроса (60 секунд)
  const response = await axiosInstance.get(`${API_URL}/api/orders`, {
    params,
    timeout: 60000,
  });

  return response.data;
};
