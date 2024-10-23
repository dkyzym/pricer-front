import { useSocketStatus } from '@hooks/useSocket';
import { SocketStatusContext } from './SocketStatusContext';

export const SocketStatusProvider = ({ children }) => {
  const socketStatus = useSocketStatus();

  return (
    <SocketStatusContext.Provider value={socketStatus}>
      {children}
    </SocketStatusContext.Provider>
  );
};
