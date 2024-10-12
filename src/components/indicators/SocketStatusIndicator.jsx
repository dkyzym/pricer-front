import { Box, Tooltip } from '@mui/material';

export const SocketStatusIndicator = ({ socketStatus }) => {
  let color;
  let tooltipText;

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
          width: 14,
          height: 14,
          bgcolor: color,
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
    </Tooltip>
  );
};
