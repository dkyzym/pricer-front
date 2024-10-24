import { SocketStatusContext } from '@context/SocketStatusContext';
import { Box, Tooltip } from '@mui/material';
import { useContext } from 'react';

export const SocketStatusIndicator = () => {
  let color;
  let tooltipText;
  const socketStatus = useContext(SocketStatusContext);

  switch (socketStatus) {
    case 'connected':
      color = 'success.main';
      tooltipText = 'Соединение установлено';
      break;
    case 'connecting':
      color = 'orange';
      tooltipText = 'Подключение...';
      break;
    case 'disconnected':
    default:
      color = 'error.main';
      tooltipText = 'Нет соединения';
      break;
  }

  return (
    <Tooltip title={tooltipText} sx={{ fontSize: 25 }}>
      <Box
        sx={{
          width: 18,
          height: 18,
          bgcolor: color,
          borderRadius: '50%',
          display: 'inline-block',
          border: '2px solid white',
          mr: 1,
        }}
      />
    </Tooltip>
  );
};
