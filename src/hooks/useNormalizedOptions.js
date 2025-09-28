import { useCallback } from 'react';

export const useNormalizedOptions = () => {
  const generateUniqueKey = useCallback((option, index = 0) => {
    if (option.isClearCommand) return 'clear-history-command';
    if (option.id) return `option-${option.id}`;
    if (option.key) return option.key;

    const keyParts = [
      option.brand || '',
      option.number || '',
      option.descr || '',
      index.toString(),
    ].filter(Boolean);

    return `generated-${keyParts.join('-')}`;
  }, []);

  const normalizeOptionsWithKeys = useCallback(
    (options, groupName) =>
      options.map((option, index) => ({
        ...option,
        group: groupName,
        key: generateUniqueKey(option, index),
      })),
    [generateUniqueKey]
  );

  const getOptionLabelText = useCallback((option) => {
    if (typeof option === 'string') return option;
    if (!option || typeof option !== 'object') return '';
    if (option.isClearCommand) return option.brand;
    return `${option.brand} - ${option.number} - ${option.descr}`;
  }, []);

  const getOptionKey = useCallback((option) => option.key, []);

  return {
    normalizeOptionsWithKeys,
    getOptionLabelText,
    getOptionKey,
  };
};
