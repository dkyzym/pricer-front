import { simulateClick } from '@utils/simulateClick';
import { useEffect } from 'react';

export const useAutoFocusClarification = (
  isClarifying,
  brandClarifications,
  inputRef
) => {
  useEffect(() => {
    if (isClarifying && brandClarifications.length > 0) {
      setTimeout(() => {
        inputRef.current?.focus();
        simulateClick(inputRef.current);
      }, 0);
    }
  }, [isClarifying, brandClarifications]);
};
