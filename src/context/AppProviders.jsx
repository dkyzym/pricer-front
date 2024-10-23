import { socket } from '@api/ws/socket';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketProvider';
import { SocketStatusProvider } from './SocketStatusProvider';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SocketProvider socket={socket}>
        <SocketStatusProvider>
          <CssBaseline />
          {children}
        </SocketStatusProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default AppProviders;
