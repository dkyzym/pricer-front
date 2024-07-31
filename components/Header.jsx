import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaHome, FaUser } from 'react-icons/fa';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          <FaHome /> Home
        </Button>
        <Button color="inherit" component={Link} to="/auth">
          <FaUser /> Auth
        </Button>
      </Toolbar>
    </AppBar>
  );
};


