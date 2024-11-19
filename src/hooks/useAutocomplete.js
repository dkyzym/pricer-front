import { SOCKET_EVENTS } from '@api/ws/socket';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setAutocompleteLoading,
  setAutocompleteResults,
  setInputValue,
} from '../redux/autocompleteSlice';

const useAutocomplete = (socket) => {
  const dispatch = useDispatch();

  const inputValue = useSelector((state) => state.autocomplete.inputValue);
  const autocompleteResults = useSelector(
    (state) => state.autocomplete.results
  );
  const isAutocompleteLoading = useSelector(
    (state) => state.autocomplete.loading
  );

  // Получаем сессии из Redux
  const sessions = useSelector((state) => state.session.sessions);

  // Находим сессию для поставщика 'ug'
  const ugSession = sessions.find(
    (session) => session.supplier === 'ug' && session.accountAlias === 'nal'
  );

  const sessionID = ugSession ? ugSession.sessionID : null;

  // Используем useRef для хранения sessionID
  const sessionIDRef = useRef(sessionID);

  useEffect(() => {
    sessionIDRef.current = sessionID;
  }, [sessionID]);

  const debouncedEmitAutocomplete = useMemo(
    () =>
      debounce((query) => {
        const currentSessionID = sessionIDRef.current;
        if (currentSessionID) {
          socket.emit(SOCKET_EVENTS.AUTOCOMPLETE, {
            sessionID: currentSessionID,
            query,
            accountAlias: 'nal',
          });
        } else {
          toast.error('Session for supplier "ug" not found');
          console.error('Session for supplier "ug" not found');
        }
      }, 300),
    [socket]
  );

  const handleInputChange = (_event, newValue) => {
    dispatch(setInputValue(newValue));
    if (newValue.trim() === '') {
      dispatch(setAutocompleteResults([]));
      dispatch(setAutocompleteLoading(false));
      return;
    }
    dispatch(setAutocompleteLoading(true));
    debouncedEmitAutocomplete(newValue);
  };

  return {
    inputValue,
    handleInputChange,
    autocompleteResults,
    isAutocompleteLoading,
  };
};

export default useAutocomplete;
