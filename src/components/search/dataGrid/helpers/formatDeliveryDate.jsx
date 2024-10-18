import { DateTime } from 'luxon';

export const formatDeliveryDate = (dateString) => {
  if (!dateString) return '';

  // Парсинг даты с использованием Luxon
  const date = DateTime.fromISO(dateString).setLocale('ru');
  const today = DateTime.local().startOf('day');
  const tomorrow = today.plus({ days: 1 });
  const dayAfterTomorrow = today.plus({ days: 2 });

  if (date.hasSame(today, 'day')) return 'сегодня';
  if (date.hasSame(tomorrow, 'day')) return 'завтра';
  if (date.hasSame(dayAfterTomorrow, 'day')) return 'послезавтра';

  // Форматирование как "23 сен."
  return date.toFormat('d LLL.');
};
