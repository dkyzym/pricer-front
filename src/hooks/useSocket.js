// useSocket.js
import { useEffect, useState } from 'react';

export const useSocket = (socket, eventHandlers) => {
  const [socketStatus, setSocketStatus] = useState(() => {
    // Инициализируем состояние из localStorage или по умолчанию 'connecting'
    return localStorage.getItem('socketStatus') || 'connecting';
  });

  useEffect(() => {
    const updateStatus = (status) => {
      setSocketStatus(status);
      localStorage.setItem('socketStatus', status);
    };

    const onConnect = () => {
      updateStatus('connected');
      if (eventHandlers.connect) eventHandlers.connect();
    };

    const onDisconnect = () => {
      updateStatus('disconnected');
      if (eventHandlers.disconnect) eventHandlers.disconnect();
    };

    const onConnecting = () => {
      updateStatus('connecting');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connecting', onConnecting);

    Object.keys(eventHandlers).forEach((event) => {
      if (!['connect', 'disconnect', 'connecting'].includes(event)) {
        socket.on(event, eventHandlers[event]);
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connecting', onConnecting);
      Object.keys(eventHandlers).forEach((event) => {
        if (!['connect', 'disconnect', 'connecting'].includes(event)) {
          socket.off(event, eventHandlers[event]);
        }
      });
    };
  }, [socket, eventHandlers]);

  return socketStatus;
};
