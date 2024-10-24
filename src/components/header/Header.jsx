import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import FollowTheSignsOutlinedIcon from '@mui/icons-material/FollowTheSignsOutlined';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginStatusIndicator } from '../auth/LoginStatusIndicator';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: '100%' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ flex: 1 }}>
          Шикарное название
        </Typography>

        <LoginStatusIndicator />

        <SocketStatusIndicator />
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<CottageOutlinedIcon />}
        >
          Поиск
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/auth"
          startIcon={<FollowTheSignsOutlinedIcon />}
        >
          Авторизация
        </Button>
      </Toolbar>
    </AppBar>
  );
};
