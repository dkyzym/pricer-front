import { getGroupKey } from '@utils/groupLogic';
import { useMemo } from 'react';

export const usePriceComparison = (data) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const grouped = new Map();
    // 1. Группируем все товары по ключу
    data.forEach((item) => {
      const key = getGroupKey(item);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(item);
    });

    const resultData = [];
    // 2. Обрабатываем каждую группу
    for (const items of grouped.values()) {
      // Пропускаем группы с одним элементом
      if (items.length < 2) {
        resultData.push(...items);
        continue;
      }

      // 3. Находим минимальную цену в группе
      const minPriceInGroup = Math.min(...items.map((i) => i.price));

      // 4. Обогащаем безналичные товары информацией о разнице в цене
      const processedItems = items.map((item) => {
        // Проверяем, является ли поставщик безналичным
        if (item.supplier?.endsWith('_bn')) {
          const difference =
            ((item.price - minPriceInGroup) / minPriceInGroup) * 100;
          return {
            ...item,
            // Добавляем новое свойство с разницей в процентах
            priceDifferencePercent: difference,
          };
        }
        return item;
      });
      resultData.push(...processedItems);
    }

    return resultData;
  }, [data]);
};
