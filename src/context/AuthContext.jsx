import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { findShortName } from '../utils/findShortName';
import { INITIAL_STATUSES } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginStatuses, setLoginStatuses] = useLocalStorage(
    'loginStatuses',
    INITIAL_STATUSES
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
      [findShortName(supplierName)]: false,
    }));
  };

  return (
    <AuthContext.Provider value={{ loginStatuses, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
