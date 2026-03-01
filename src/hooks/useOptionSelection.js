import { useCallback } from 'react';

export const useOptionSelection = ({
  clearHistory,
  handleInputChange,
  addToHistory,
  handleOptionSelect,
}) => {
  return useCallback(
    (event, newValue) => {
      if (!newValue) return;

      if (typeof newValue === 'object' && newValue !== null) {
        addToHistory(newValue);
      }

      handleOptionSelect(event, newValue);
    },
    [addToHistory, handleOptionSelect]
  );
};
