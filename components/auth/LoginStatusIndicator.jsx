import { Avatar, Box } from '@mui/material';
import { SUPPLIERS } from '../../utils/constants';

export const LoginStatusIndicator = ({ statuses }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mr: '20%' }}>
      {SUPPLIERS.map((supplier) => {
        const isLoggedIn = statuses[supplier.shortName];

        return (
          <Avatar
            key={supplier.name}
            sx={{
              bgcolor: isLoggedIn
                ? (theme) => theme.palette[supplier.color].main
                : 'grey.400',
              color: isLoggedIn
                ? (theme) =>
                    theme.palette.getContrastText(
                      theme.palette[supplier.color].main
                    )
                : (theme) => theme.palette[supplier.color].main,
              borderColor: (theme) => theme.palette[supplier.color].main,
              borderWidth: 2,
              borderStyle: 'solid',
              width: 28,
              height: 28,
              fontSize: 14,
            }}
          >
            {supplier.shortName}
          </Avatar>
        );
      })}
    </Box>
  );
};
