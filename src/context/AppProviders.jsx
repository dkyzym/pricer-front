import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { finishCheckingAuth, setUser } from 'src/redux/authSlice';
import store from '../redux/store';
import { SocketProvider } from './SocketProvider';
import { SocketStatusProvider } from './SocketStatusProvider';

const InitAuth = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }

    dispatch(finishCheckingAuth());
  }, [dispatch]);

  return children;
};

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <InitAuth>
        <SocketProvider>
          <SocketStatusProvider>
            <CssBaseline />
            {children}
          </SocketStatusProvider>
        </SocketProvider>
      </InitAuth>
    </Provider>
  );
}
