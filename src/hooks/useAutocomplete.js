import { SOCKET_EVENTS } from '@api/ws/socket';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';

const useAutocomplete = (socket) => {
  const [inputValue, setInputValue] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);

  const debouncedEmitAutocomplete = useMemo(
    () =>
      debounce((query) => socket.emit(SOCKET_EVENTS.AUTOCOMPLETE, query), 300),
    [socket]
  );

  const handleInputChange = (_event, newValue) => {
    setInputValue(newValue);
    if (newValue.trim() === '') {
      setAutocompleteResults([]);
      setIsAutocompleteLoading(false);
      return;
    }
    setIsAutocompleteLoading(true);
    debouncedEmitAutocomplete(newValue);
  };

  return {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
    setInputValue,
    setIsAutocompleteLoading,
    setAutocompleteResults,
  };
};

export default useAutocomplete;
