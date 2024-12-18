import { socket } from '@api/ws/socket';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { SocketProvider } from './SocketProvider';
import { SocketStatusProvider } from './SocketStatusProvider';

const AppProviders = ({ children }) => {
  return (
    <SocketProvider socket={socket}>
      <Provider store={store}>
        <SocketStatusProvider>
          <CssBaseline />
          {children}
        </SocketStatusProvider>
      </Provider>
    </SocketProvider>
  );
};

export default AppProviders;
