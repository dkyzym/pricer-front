const generateUniqueKey = (option, index = 0) => {
  if (option.id) return `option-${option.id}`;
  if (option.key) return option.key;

  const keyParts = [
    option.brand || '',
    option.number || '',
    option.descr || '',
    index.toString(),
  ].filter(Boolean);

  return `generated-${keyParts.join('-')}`;
};

const normalizeOptionsWithKeys = (options, groupName) =>
  options.map((option, index) => ({
    ...option,
    group: groupName,
    key: generateUniqueKey(option, index),
  }));

/**
 * Формирует итоговый список опций для Autocomplete.
 *
 * @param {object} params
 * @param {boolean}  params.isClarifying         - режим уточнения бренда
 * @param {Array}    params.brandClarifications   - бренды из Redux
 * @param {string}   params.inputValue            - текущее значение поля ввода
 * @param {Array}    params.autocompleteResults   - результаты автодополнения
 * @param {Array}    params.history               - история поиска
 * @returns {Array} нормализованный массив опций с полями `group` и `key`
 */
export const buildDisplayOptions = ({
  isClarifying,
  brandClarifications,
  inputValue,
  autocompleteResults,
  history,
}) => {
  const filteredBrands =
    isClarifying && brandClarifications?.length
      ? brandClarifications.filter((option) =>
          option.brand?.toLowerCase().includes(inputValue.toLowerCase())
        )
      : [];

  const combinedOptions = isClarifying ? filteredBrands : autocompleteResults;

  if (inputValue.trim() !== '' || isClarifying) {
    const groupName = isClarifying ? 'Уточнение бренда' : 'Результаты поиска';
    return normalizeOptionsWithKeys(combinedOptions, groupName);
  }

  if (history.length > 0) {
    return normalizeOptionsWithKeys(history, 'История поиска');
  }

  return [];
};
