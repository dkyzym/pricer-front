import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import FollowTheSignsOutlinedIcon from '@mui/icons-material/FollowTheSignsOutlined';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginStatusIndicator } from './auth/LoginStatusIndicator';

export const Header = () => {
  const loginStatuses = {
    ЮГ: true,
    TC: false,
    ПТ: true,
    AR: false,
    OR: true,
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          Pricer
        </Typography>

        <LoginStatusIndicator statuses={loginStatuses} />

        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<CottageOutlinedIcon />}
        >
          Home
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/auth"
          startIcon={<FollowTheSignsOutlinedIcon />}
        >
          Auth
        </Button>
      </Toolbar>
    </AppBar>
  );
};
