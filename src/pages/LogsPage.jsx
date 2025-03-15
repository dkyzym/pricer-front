import { HistoryLogs } from '@components/logs/HistoryLogs';
import { RealtimeLogs } from '@components/logs/RealtimeLogs';
import { Typography } from '@mui/material';

export const LogsPage = () => {
  return (
    <>
      <Typography>LogsPage</Typography>
      <HistoryLogs />
      <RealtimeLogs />
    </>
  );
};
