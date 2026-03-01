import { useSupplierSelection } from '@hooks/useSupplierSelection';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { dedupeResults } from '@utils/dedupeResults';

/**
 * Один элемент цепочки фильтрации: предложение от поставщика в агрегаторе запчастей.
 * @typedef {Object} FilteredPipelineItem
 * @property {string} [supplier] — идентификатор поставщика
 * @property {string} [article] — артикул
 * @property {number} [price] — цена
 * @property {string} [deliveryDate] — дата поставки (ISO)
 * @property {number|string} [availability] — наличие, кол-во
 * @property {number} [multi] — кратность отгрузки
 */

/**
 * Стейт и сеттеры фильтров, передаваемые в ActionBar.
 * Инкапсуляция здесь не даёт «размазывать» множество useState по компонентам.
 * @typedef {Object} FilterProps
 * @property {Object} supplierStatus — статусы поставщиков из Redux
 * @property {string} maxDeadline — макс. срок доставки в днях (строка)
 * @property {function(string): void} setMaxDeadline
 * @property {import('luxon').DateTime | null} maxDeliveryDate — макс. дата доставки
 * @property {function(import('luxon').DateTime | null): void} setMaxDeliveryDate
 * @property {string} maxPrice — макс. цена (строка)
 * @property {function(string): void} setMaxPrice
 * @property {string} minQuantity — мин. количество (строка)
 * @property {function(string): void} setMinQuantity
 */

/** ug_f в UI отображается как ug; нормализация для сопоставления с item.supplier. */
const normalizeSupplier = (s) => (s === 'ug_f' ? 'ug' : s);

/**
 * Пайплайн: supplierStatus → allResults → uniqueResults → bySupplier → data.
 * Каждый шаг в отдельном useMemo — пересчёт только при изменении входов шага.
 *
 * @returns {{ data: FilteredPipelineItem[], filterProps: FilterProps }}
 */
export const useFilteredPipeline = () => {
  const supplierStatus = useSelector((state) => state.supplier.supplierStatus);
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

  /** Финальный фильтр: срок/дата, цена, мин. количество, кратность (multi). */
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
    supplierStatus,
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
