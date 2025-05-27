// utils/dedupeResults.ts
export function dedupeResults(items) {
  const normalize = (v) => (v ?? '').toString().trim().toLowerCase();

  const seen = new Set();

  return items.filter((it) => {
    // ключ уникальности: оставь только то, что действительно делает товар “тем же самым”
    const key = [
      normalize(it.article),
      normalize(it.brand),
      normalize(it.price), // если price число → оставь как есть
      normalize(it.inner_product_code),
      normalize(it.warehouse_id),
    ].join('|');

    if (seen.has(key)) return false; // дубль → вырезаем
    seen.add(key);
    return true; // впервые встретили → оставляем
  });
}
