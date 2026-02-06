import axiosInstance from './axiosInstance';
import { API_URL } from './config';

/**
 * Fetch orders from backend.
 * @param {string[] | undefined} suppliers - array of supplier aliases (e.g. ['ug', 'ug_bn']).
 *   If omitted or empty, backend will fall back to its default (all handlers).
 */
export const fetchOrdersApi = async (suppliers) => {
  const hasSuppliers =
    Array.isArray(suppliers) && suppliers.filter(Boolean).length > 0;

  const params = hasSuppliers
    ? {
        suppliers: suppliers.join(','),
      }
    : undefined;

  const response = await axiosInstance.get(`${API_URL}/api/orders`, {
    params,
  });

  return response.data;
};

