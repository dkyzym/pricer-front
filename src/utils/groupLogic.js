/**
 * Создает уникальный ключ для группировки товаров по строгим правилам.
 * @param {object} item - Объект товара.
 * @returns {string} - Уникальный ключ группы.
 */
export const getGroupKey = (item) => {
  if (!item) return `unique-${Math.random()}`;

  const originalSupplier = item.supplier || '';

  // --- Логика для 'ug' ---
  // Проверяем, принадлежит ли поставщик к семейству 'ug' ('ug', 'ug_f', 'ug_bn')
  if (originalSupplier === 'ug' || originalSupplier.startsWith('ug_')) {
    // Используем логику, аналогичную 'autosputnik', но БЕЗ warehouse_id.
    return `ug-group-${item.article}-${item.brand}-${item.availability}-${item.allow_return}-${item.deliveryDate}-${item.probability}`;
  }

  // --- Логика для 'autosputnik' ---
  // Проверяем, принадлежит ли поставщик к семейству 'autosputnik'
  if (
    originalSupplier === 'autosputnik' ||
    originalSupplier.startsWith('autosputnik_')
  ) {
    // Используем строгий набор полей для создания ключа, как и просили.
    return `autosputnik-group-${item.article}-${item.brand}-${item.availability}-${item.allow_return}-${item.deliveryDate}-${item.probability}-${item.warehouse_id}`;
  }

  // --- Логика по умолчанию для всех остальных поставщиков ---
  return `default-group-${item.supplier}-${item.article}-${item.brand}-${item.id}`;
};
