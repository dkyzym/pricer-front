import { SocketContext } from '@context/SocketContext';
import { useContext, useEffect, useState } from 'react';

export const useSocketStatus = () => {
  const socket = useContext(SocketContext);
  const [socketStatus, setSocketStatus] = useState('disconnected');

  useEffect(() => {
    if (!socket) {
      // Если сокета нет, показываем "disconnected" (или "no-socket")
      setSocketStatus('disconnected');
      return;
    }

    // Если сокет есть, ставим 'connecting' или сразу 'connected',
    // если socket.io клиент уже успел подключиться
    setSocketStatus(socket.connected ? 'connected' : 'connecting');

    const onConnect = () => setSocketStatus('connected');
    const onDisconnect = () => setSocketStatus('disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return socketStatus;
};
