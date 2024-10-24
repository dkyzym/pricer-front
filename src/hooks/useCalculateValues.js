import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useCalculatedValues = (filteredData) => {
  const { minPrice, minDeadline, maxProbability, minDeliveryDate } =
    useMemo(() => {
      const prices = filteredData.map((item) => item.price);
      const deadlines = filteredData.map((item) => item.deadline);
      const probabilities = filteredData
        .filter((item) => item.probability !== '')
        .map((item) => item.probability);
      const deliveryDates = filteredData
        .map((item) => DateTime.fromISO(item.deliveryDate))
        .filter((date) => date.isValid);

      return {
        minPrice: Math.min(...prices),
        minDeadline: Math.min(...deadlines),
        maxProbability: Math.max(...probabilities),
        minDeliveryDate: deliveryDates.reduce(
          (minDate, date) => (date < minDate ? date : minDate),
          DateTime.fromISO('9999-12-31')
        ),
      };
    }, [filteredData]);

  return { minPrice, minDeadline, maxProbability, minDeliveryDate };
};
