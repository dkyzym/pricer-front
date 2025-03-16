import { HistoryLogs } from '@components/logs/HistoryLogs';
import { RealtimeLogs } from '@components/logs/RealtimeLogs';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

export const LogsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const authUserStr = localStorage.getItem('authUser');
  const authUser = authUserStr ? JSON.parse(authUserStr) : null;
  const token = authUser?.token || '';

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="History" />
        <Tab label="Stream" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <HistoryLogs token={token} />}
        {tabIndex === 1 && <RealtimeLogs />}
      </Box>
    </Box>
  );
};
