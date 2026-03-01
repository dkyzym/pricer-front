import { useSupplierSelection } from '@hooks/useSupplierSelection';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { dedupeResults } from '@utils/dedupeResults';

const normalizeSupplier = (s) => (s === 'ug_f' ? 'ug' : s);

/**
 * Единый пайплайн:
 * supplierStatus → allResults → uniqueResults → bySupplier → finalFiltered
 *
 * Каждый шаг обёрнут в собственный useMemo, поэтому пересчитывается
 * только та часть цепочки, чьи входные данные реально изменились.
 *
 * Возвращает { data, filterProps } — отфильтрованные данные и стейт фильтров
 * для передачи в ActionBar.
 */
export const useFilteredPipeline = (supplierStatus) => {
  const { selectedSuppliers } = useSupplierSelection();

  const [maxDeadline, setMaxDeadline] = useState('');
  const [maxDeliveryDate, setMaxDeliveryDate] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');

  const allResults = useMemo(
    () => Object.values(supplierStatus).flatMap((s) => s.results.data || []),
    [supplierStatus]
  );

  const uniqueResults = useMemo(
    () => dedupeResults(allResults),
    [allResults]
  );

  const bySupplier = useMemo(() => {
    const normalized = selectedSuppliers.map(normalizeSupplier);
    return uniqueResults.filter((item) =>
      normalized.includes(normalizeSupplier(item.supplier))
    );
  }, [uniqueResults, selectedSuppliers]);

  const data = useMemo(() => {
    const now = DateTime.now();

    return bySupplier.filter((item) => {
      const deliveryDate = DateTime.fromISO(item?.deliveryDate);

      if (!deliveryDate?.isValid) return false;

      const daysUntilDelivery = deliveryDate.diff(now, 'days').days;

      if (deliveryDate.startOf('day') < now.startOf('day')) return false;

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

      const availability = parseFloat(item.availability);
      const isAvailabilityValid = !isNaN(availability);

      const isMinQuantityValid =
        minQuantity === '' ||
        isNaN(minQuantity) ||
        (isAvailabilityValid && availability >= parseFloat(minQuantity));

      const isMultiValid =
        !item.multi || (isAvailabilityValid && availability % item.multi === 0);

      return isDeadlineValid && isPriceValid && isMinQuantityValid && isMultiValid;
    });
  }, [bySupplier, maxDeadline, maxDeliveryDate, maxPrice, minQuantity]);

  const filterProps = {
    maxDeadline,
    setMaxDeadline,
    maxDeliveryDate,
    setMaxDeliveryDate,
    maxPrice,
    setMaxPrice,
    minQuantity,
    setMinQuantity,
  };

  return { data, filterProps };
};
