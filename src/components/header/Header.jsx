import { SocketStatusIndicator } from '@components/indicators/SocketStatusIndicator';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: '100%' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ flex: 1 }}>
          Шикарное название
        </Typography>

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
    </AppBar>
  );
};
