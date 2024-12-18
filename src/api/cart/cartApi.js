import axiosInstance from '@api/axiosInstance';
import { CREDENTIALS } from '@utils/constants';

export const addToCart = async (item) => {
  const { supplier, quantity } = item;

  // Унифицированный формат данных
  // В зависимости от поставщика применяем разные параметры
  if (supplier === 'profit') {
    const data = {
      id: item.innerId,
      warehouse: item.warehouse_id,
      quantity,
      code: item.inner_product_code,
      supplier: item.supplier,
    };

    const url = CREDENTIALS['profit'].addToCartURL;
    const response = await axiosInstance.post(url, data);
    if (response.data.success) {
      return { success: true, message: 'Товар добавлен в корзину (Profit)' };
    } else {
      return {
        success: false,
        message: 'Ошибка добавления в корзину (Profit)',
      };
    }
  } else if (supplier == 'ug') {
    // Для остальных поставщиков унифицированный запрос
    // Предположим у них единый эндпоинт /api/cart/add
    // И они не требуют специфичных полей
    const url = '/api/cart/add'; // Это может быть динамическое значение или тоже в CREDENTIALS

    const data = {
      supplier,
      brand: item.brand,
      supplierCode: item.warehouse_id,
      quantity,
      number: item.number,
      itemKey: item.inner_product_code,
    };

    const response = await axiosInstance.post(url, data);
    console.log(response);
    return {
      success: response.data.success,
      message: response.data.success
        ? 'Товар добавлен в корзину'
        : 'Ошибка добавления в корзину',
    };
  }
};
