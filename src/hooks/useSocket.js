import { useEffect, useState } from 'react';

export const useSocket = (socket) => {
  const [socketStatus, setSocketStatus] = useState('connecting');

  useEffect(() => {
    const updateStatus = (status) => {
      setSocketStatus(status);
      // localStorage.setItem('socketStatus', status);
    };

    const onConnect = () => {
      updateStatus('connected');
      // if (eventHandlers.connect) eventHandlers.connect();
    };

    const onDisconnect = () => {
      updateStatus('disconnected');
      // if (eventHandlers.disconnect) eventHandlers.disconnect();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return socketStatus;
};
