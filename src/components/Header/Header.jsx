import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  AppBar,
  Box,
  Button,
  Container,
  SvgIcon,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { default as logoUrl } from '../../images/logo.svg';

const LogoIcon = (props) => (
  <SvgIcon {...props}>
    <image href={logoUrl} width="100%" height="100%" color="white" />
  </SvgIcon>
);

export const Header = () => {
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
          <Button
            color="inherit"
            component={Link}
            to="/cart"
            startIcon={<ShoppingCartCheckoutIcon />}
          >
            Корзина
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
