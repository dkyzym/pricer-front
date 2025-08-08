import { getGroupKey } from '@utils/groupLogic';
import { useEffect } from 'react';
// использовали чтобы логировать группы н - б/н
export const useGroupedDataLogger = (data, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    if (!data || data.length === 0) {
      console.log('ДИАГНОСТИКА: Данные для группировки отсутствуют.');
      return;
    }

    const grouped = new Map();
    data.forEach((item) => {
      const key = getGroupKey(item);

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(item);
    });

    // Очищаем консоль для наглядности при каждом обновлении данных
    console.clear();
    console.log(
      `--- ДИАГНОСТИКА ГРУППИРОВКИ (Найдено ${grouped.size} уникальных ключей) ---`
    );

    let groupsFound = 0;
    // Выводим только те группы, где больше одного элемента (т.е. наши пары)
    for (const [key, items] of grouped.entries()) {
      if (items.length > 1) {
        groupsFound++;
        console.group(`Найденная Группа #${groupsFound} (Ключ: ${key})`);
        console.table(items); // Выводим группу в виде удобной таблицы
        console.groupEnd();
      }
    }

    if (groupsFound === 0) {
      console.warn(
        'ПРЕДУПРЕЖДЕНИЕ: Не найдено ни одной группы из 2+ элементов по заданным строгим правилам. Возможно, у товаров, которые должны быть парой, не совпадают все поля в ключе (например, availability или warehouse_id).'
      );
    }

    console.log('--- КОНЕЦ ДИАГНОСТИКИ ---');
  }, [data, isActive]);
};
