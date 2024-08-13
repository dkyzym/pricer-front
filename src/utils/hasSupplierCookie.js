export const hasSupplierCookie = (supplierName = '') => {
  const supplierCookiePrefix = supplierName.toLowerCase();

  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());

  return cookies.some((cookie) => cookie.startsWith(supplierCookiePrefix));
};
