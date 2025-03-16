import { SocketContext } from '@context/SocketContext';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { stripAnsi } from '@utils/ansiRegex';
import { colorByLevel, colorByUser } from '@utils/colorMaps';
import { useContext, useEffect, useState } from 'react';

export const RealtimeLogs = () => {
  const socket = useContext(SocketContext);
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleLogMessage = (logInfo) => {
      const cleanMsg = stripAnsi(logInfo.message || '');
      const cleanStack = logInfo.stack ? stripAnsi(logInfo.stack) : null;

      const newLog = {
        ...logInfo,
        message: cleanMsg,
        stack: cleanStack,
        timestamp: logInfo.timestamp || new Date().toLocaleTimeString(), // если нет timestamp, вставим локальное время
      };

      setLogMessages((prev) => [newLog, ...prev]);
    };

    socket.on('logMessage', handleLogMessage);
    return () => {
      socket.off('logMessage', handleLogMessage);
    };
  }, [socket]);

  return (
    <Box sx={{ p: 2 }}>
      <List sx={{ maxHeight: 500, overflowY: 'auto' }}>
        {logMessages.map((log, idx) => {
          const levelColor = colorByLevel(log.level);
          const userColor = colorByUser(log.user);

          return (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    <Typography
                      component="span"
                      sx={{ fontWeight: 'bold', color: levelColor }}
                    >
                      [{log.timestamp}] [{log.level}]
                    </Typography>{' '}
                    <Typography component="span" sx={{ color: userColor }}>
                      user={log.user || '-'}
                    </Typography>{' '}
                    <Typography component="span">msg={log.message}</Typography>
                  </>
                }
                secondary={
                  log.stack ? (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {log.stack}
                      </Typography>
                    </Box>
                  ) : null
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
