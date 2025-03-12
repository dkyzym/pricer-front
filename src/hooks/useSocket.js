import { SocketContext } from '@context/SocketContext';
import { useContext, useEffect, useState } from 'react';

export const useSocketStatus = () => {
  const socket = useContext(SocketContext);
  const [socketStatus, setSocketStatus] = useState('connecting');

  useEffect(() => {
    if (!socket) return;

    // Если сокет уже подключён, сразу ставим статус
    if (socket.connected) {
      setSocketStatus('connected');
    }

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
