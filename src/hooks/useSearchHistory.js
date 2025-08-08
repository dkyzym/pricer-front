import { useCallback, useEffect, useState } from 'react';

// Ключ для хранения данных в localStorage
const HISTORY_KEY = 'searchHistory';
// Максимальное количество записей в истории
const MAX_HISTORY_SIZE = 3;

/**
 * Хук для управления историей поиска.
 * @returns {{history: object[], addToHistory: function(object): void, clearHistory: function(): void}}
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState([]);

  // Загружаем историю из localStorage при первоначальной загрузке компонента
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error(
        'Не удалось загрузить историю поиска из localStorage:',
        error
      );
      setHistory([]);
    }
  }, []);

  /**
   * Добавляет элемент в историю поиска.
   * Если элемент уже существует, он перемещается в начало списка.
   */
  const addToHistory = useCallback((item) => {
    if (!item || typeof item !== 'object' || !item.key) {
      return;
    }

    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(
        (historyItem) => historyItem.key !== item.key
      );
      const newHistory = [item, ...filteredHistory];
      const trimmedHistory = newHistory.slice(0, MAX_HISTORY_SIZE);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
      } catch (error) {
        console.error(
          'Не удалось сохранить историю поиска в localStorage:',
          error
        );
      }

      return trimmedHistory;
    });
  }, []);

  // NEW: Функция для полной очистки истории
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]); // Очищаем состояние для немедленного обновления UI
    } catch (error) {
      console.error('Не удалось очистить историю поиска:', error);
    }
  }, []);

  return { history, addToHistory, clearHistory };
};
