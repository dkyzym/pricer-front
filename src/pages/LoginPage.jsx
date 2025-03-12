import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from 'src/redux/authSlice';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Здесь имитируем ответ с бэкенда.
    // В реальном проекте сделаете вызов API.
    const fakeUser = {
      name: 'Test User',
      login: 'user0',
      role: 'admin',
      token: 'fake-jwt-token',
    };

    // Запоминаем в Redux
    dispatch(setUser(fakeUser));

    // Если стоит "галочка" - кладём в localStorage
    if (rememberMe) {
      localStorage.setItem('authUser', JSON.stringify(fakeUser));
    }

    // После логина переходим на главную страницу (или куда нужно)
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '50px auto' }}>
      <Typography variant="h5" mb={2}>
        Вход
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Логин"
          fullWidth
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Запомнить меня"
        />
        <Button type="submit" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Box>
  );
};
