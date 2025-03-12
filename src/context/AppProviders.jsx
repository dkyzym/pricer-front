import { socket } from '@api/ws/socket';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { finishCheckingAuth, setUser } from 'src/redux/authSlice';
import store from '../redux/store';
import { SocketProvider } from './SocketProvider';
import { SocketStatusProvider } from './SocketStatusProvider';

/**
 * Вспомогательный компонент, который при монтировании
 * восстанавливает состояние auth из localStorage.
 */
const InitAuth = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
    // По окончании проверки ставим isCheckingAuth = false
    dispatch(finishCheckingAuth());
  }, [dispatch]);

  return children;
};

const AppProviders = ({ children }) => {
  return (
    // Подключаем сокет-провайдеры (если нужно, сразу при старте)
    <SocketProvider socket={socket}>
      <Provider store={store}>
        <SocketStatusProvider>
          <InitAuth>
            <CssBaseline />
            {children}
          </InitAuth>
        </SocketStatusProvider>
      </Provider>
    </SocketProvider>
  );
};

export default AppProviders;
