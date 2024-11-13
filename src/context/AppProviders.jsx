import { socket } from '@api/ws/socket';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketProvider';
import { SocketStatusProvider } from './SocketStatusProvider';

const AppProviders = ({ children }) => {
  return (
    <SocketProvider socket={socket}>
      <Provider store={store}>
        <AuthProvider>
          <SocketStatusProvider>
            <CssBaseline />
            {children}
          </SocketStatusProvider>
        </AuthProvider>
      </Provider>
    </SocketProvider>
  );
};

export default AppProviders;
