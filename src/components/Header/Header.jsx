import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import HistoryIcon from '@mui/icons-material/History';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  AppBar,
  Box,
  Button,
  Container,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from 'src/redux/authSlice';
import { default as logoUrl } from '../../images/logo.svg';

const LogoIcon = (props) => (
  <SvgIcon {...props}>
    <image href={logoUrl} width="100%" height="100%" color="white" />
  </SvgIcon>
);

export const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem('authUser');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <Box sx={{ maxWidth: '200px' }}>
              <Box
                sx={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogoIcon sx={{ fontSize: '120px' }} />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ fontSize: 12, fontWeight: 100 }}>
              Шикарное Название
            </Typography>
          </Box>

          <SocketStatusIndicator />
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<ManageSearchIcon />}
          >
            Поиск
          </Button>
          {isAdmin && (
            <Button
              color="inherit"
              component={Link}
              to="/cart"
              startIcon={<ShoppingCartCheckoutIcon />}
            >
              Корзина
            </Button>
          )}
          {isAdmin && (
            <Tooltip title="Логи">
              <Button color="inherit" component={Link} to="/admin/logs">
                <HistoryIcon />
              </Button>
            </Tooltip>
          )}
          {user ? (
            <>
              <Typography variant="subtitle1" sx={{ ml: 2 }}>
                Привет, {user.username}!
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Войти
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
