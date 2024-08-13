import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './AuthContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CssBaseline />
      {children}
    </AuthProvider>
  );
};

export default AppProviders;
