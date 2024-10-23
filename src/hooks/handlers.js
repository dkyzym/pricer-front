import { toast } from 'react-toastify';

export const handleBrandClarificationError = (error, setIsClarifying) => {
  toast.error(error.message);
  setIsClarifying(false);
};

export const handleClearInput = (
  setInputValue,
  setAutocompleteResults,
  setIsAutocompleteLoading,
  inputRef
) => {
  setInputValue('');
  setAutocompleteResults([]);
  setIsAutocompleteLoading(false);

  if (inputRef.current) {
    inputRef.current.focus();
  }
};

export const handleAutocompleteError = (
  error,
  setAutocompleteResults,
  setIsAutocompleteLoading
) => {
  toast.error(error.message);
  setAutocompleteResults([]);
  setIsAutocompleteLoading(false);
};

export const handleOptionSelect = (
  _event,
  value,
  resetSupplierStatus,
  handleBrandClarification,
  handleDetailedSearch
) => {
  if (value) {
    resetSupplierStatus();

    if (value.brand.trim().includes('Найти') && !value.description) {
      handleBrandClarification(value);
    } else {
      handleDetailedSearch(value);
    }
  }
};
