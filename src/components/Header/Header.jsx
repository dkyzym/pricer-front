import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from 'src/redux/authSlice';
import { default as logoUrl } from '../../images/logo.svg';

const LogoIcon = (props) => (
  <SvgIcon {...props}>
    <image href={logoUrl} width="100%" height="100%" />
  </SvgIcon>
);

export const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin';

  const [visible, setVisible] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authUser');
  };

  useEffect(() => {
    const collapseThreshold = 600; // Высота окна, при которой скрываем хедер

    const handleResize = () => {
      setVisible(window.innerHeight >= collapseThreshold);
    };

    // Вызываем сразу при монтировании, чтобы установить правильное начальное состояние
    handleResize(); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {visible && (
        <AppBar
          position="static"
          sx={{
            transition: 'height 0.3s ease',
            height: 80,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar>
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
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
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/cart"
                    startIcon={<ShoppingCartCheckoutIcon />}
                  >
                    Корзина
                  </Button>
                  <Tooltip title="Логи">
                    <Button color="inherit" component={Link} to="/admin/logs">
                      <HistoryIcon />
                    </Button>
                  </Tooltip>
                </>
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
      )}

      {!visible && (
        <Fab
          color="primary"
          size="small"
          onClick={() => setVisible(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1300,
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
    </>
  );
};