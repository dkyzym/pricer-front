import { useEffect, useState } from 'react';

export const useSocket = (socket) => {
  const [socketStatus, setSocketStatus] = useState('connecting');

  useEffect(() => {
    const updateStatus = (status) => {
      setSocketStatus(status);
    };

    const onConnect = () => {
      updateStatus('connected');
    };

    const onDisconnect = () => {
      updateStatus('disconnected');
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
