import { SUPPLIERS } from './constants';

export const findShortName = (selectedSupplier = '') => {
  return SUPPLIERS.find((sup) => sup.name === selectedSupplier).shortName;
};
