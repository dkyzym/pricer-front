import { API_URL } from '@api/config';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // В store.auth.user (см. authSlice) мы храним { username, role, token }
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Нет пользователя → отключаем сокет, если он вдруг есть
    if (!user || !user.token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Если пользователь есть, подключаемся к сокету
    const newSocket = io(API_URL, {
      autoConnect: true,
      reconnection: true,
      query: { token: user.token },
    });

    setSocket(newSocket);

    // Когда эффект «убивается» (например, при логауте), отключаемся
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
