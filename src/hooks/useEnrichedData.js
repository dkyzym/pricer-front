import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useEnrichedData = (
  filteredData,
  { minPrice, minDeliveryDate }
) => {
  return useMemo(() => {
    return filteredData.map((item) => {
      const deliveryDate = DateTime.fromISO(item.deliveryDate);

      return {
        ...item,
        isBestPrice: item.price === minPrice,
        isFastest: deliveryDate.hasSame(minDeliveryDate, 'day'),
        isBestOverall:
          item.price === minPrice &&
          deliveryDate.hasSame(minDeliveryDate, 'day'),
      };
    });
  }, [filteredData, minPrice, minDeliveryDate]);
};
