import { useEffect, useState } from 'react';

export const useSocket = (socket, eventHandlers) => {
  const [socketStatus, setSocketStatus] = useState('connecting');

  useEffect(() => {
    const onConnect = () => {
      setSocketStatus('connected');
      if (eventHandlers.connect) eventHandlers.connect();
    };

    const onDisconnect = () => {
      setSocketStatus('disconnected');
      if (eventHandlers.disconnect) eventHandlers.disconnect();
    };

    const onConnecting = () => {
      setSocketStatus('connecting');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connecting', onConnecting);

    // Регистрация пользовательских обработчиков
    Object.keys(eventHandlers).forEach((event) => {
      if (event !== 'connect' && event !== 'disconnect') {
        socket.on(event, eventHandlers[event]);
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connecting', onConnecting);
      Object.keys(eventHandlers).forEach((event) => {
        if (event !== 'connect' && event !== 'disconnect') {
          socket.off(event, eventHandlers[event]);
        }
      });
    };
  }, [socket, eventHandlers]);

  return socketStatus;
};
