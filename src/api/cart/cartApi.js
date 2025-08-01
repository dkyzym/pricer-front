import axiosInstance from '@api/axiosInstance';
import { API_URL } from '@api/config';

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

    const url = `${API_URL}/api/cart/add`;
    const response = await axiosInstance.post(url, data);
    if (response.data.success) {
      return { success: true, message: 'Товар добавлен в корзину (Profit)' };
    } else {
      return {
        success: false,
        message: 'Ошибка добавления в корзину (Profit)',
      };
    }
  } else if (
    supplier === 'ug' ||
    supplier === 'patriot' ||
    supplier === 'npn'
  ) {
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
  } else if (supplier === 'autosputnik') {
    const url = '/api/cart/add'; // Это может быть динамическое значение или тоже в CREDENTIALS

    const data = {
      supplier,
      amount: quantity,
      articul: item.article,
      brand: item?.autosputnik.brand,
      id_shop_prices: item?.autosputnik.id_shop_prices,
      price: item.price,
    };
    console.log(data);
    const response = await axiosInstance.post(url, data);
    console.log(response);
    return {
      success: response.data.success,
      message: response.data.success
        ? 'Товар добавлен в корзину'
        : 'Ошибка добавления в корзину',
    };
  } else if (supplier === 'turboCars') {
    const url = '/api/cart/add';

    const data = {
      supplier,
      QTY: quantity,
      StockID: item.turboCars.stock_id,
      ZakazCode: item.turboCars.zakazCode,
      nal: item.turboCars.nal,
    };
    console.log(data);
    const response = await axiosInstance.post(url, data);
    console.log(response);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  }
};
