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

      if (newValue.isClearCommand) {
        clearHistory();
        handleInputChange(event, '', 'clear');
        return;
      }

      if (typeof newValue === 'object' && newValue !== null) {
        addToHistory(newValue);
      }

      handleOptionSelect(event, newValue);
    },
    [clearHistory, handleInputChange, addToHistory, handleOptionSelect]
  );
};
