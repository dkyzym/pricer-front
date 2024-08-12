import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialStatuses = {
    ЮГ: false,
    TC: false,
    ПТ: false,
    AR: false,
    OR: false,
  };

  const [loginStatuses, setLoginStatuses] = useLocalStorage(
    'loginStatuses',
    initialStatuses
  );

  const login = (supplierName) => {
    setLoginStatuses((prevStatuses) => ({
      ...prevStatuses,
      [supplierName]: true,
    }));
  };

  const logout = (supplierName) => {
    setLoginStatuses((prevStatuses) => ({
      ...prevStatuses,
      [supplierName]: false,
    }));
  };

  return (
    <AuthContext.Provider value={{ loginStatuses, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
