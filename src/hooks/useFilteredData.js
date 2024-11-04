import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

export const useFilteredData = (
  allResults,
  maxDeadline,
  maxDeliveryDate,
  maxPrice,
  minQuantity
) => {
  return useMemo(() => {
    const now = DateTime.now();

    return allResults.filter((item) => {
      const deliveryDate = DateTime.fromISO(item.deliveryDate);

      if (!deliveryDate.isValid) {
        toast.warn('Дата - что-то пошло не так.');
        return false;
      }

      const daysUntilDelivery = deliveryDate.diff(now, 'days').days;

      if (deliveryDate.startOf('day') < now.startOf('day')) {
        toast.warn('Смотреть в завтрашний день могут не только лишь все...');
        return false;
      }

      let isDeadlineValid = true;

      if (maxDeliveryDate) {
        isDeadlineValid = deliveryDate <= maxDeliveryDate.endOf('day');
      } else if (maxDeadline !== '' && !isNaN(maxDeadline)) {
        isDeadlineValid = daysUntilDelivery <= parseFloat(maxDeadline);
      }

      const isPriceValid =
        maxPrice === '' ||
        isNaN(maxPrice) ||
        item.price <= parseFloat(maxPrice);

      // Получаем доступность и преобразуем в число
      const availability = parseFloat(item.availability);
      const isAvailabilityValid = !isNaN(availability);

      const isMinQuantityValid =
        minQuantity === '' ||
        isNaN(minQuantity) ||
        (isAvailabilityValid && availability >= parseFloat(minQuantity));

      const isMultiValid =
        item &&
        item?.multi &&
        isAvailabilityValid &&
        availability % item.multi === 0;

      return (
        isDeadlineValid && isPriceValid && isMinQuantityValid && isMultiValid
      );
    });
  }, [allResults, maxDeadline, maxDeliveryDate, maxPrice, minQuantity]); // Добавляем minQuantity в зависимости
};
