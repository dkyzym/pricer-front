import { API_URL } from '@api/config';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Шлём запрос на бэкенд
      const response = await axios.post(`${API_URL}/api/auth`, {
        username: login,
        password,
      });

      // На бэкенде у вас возвращается объект вида { token, user: {username, role} }
      const { token, user } = response.data;

      // Формируем объект, который будем хранить в Redux
      const userData = {
        ...user,
        token,
      };

      // Пишем в Redux
      dispatch(setUser(userData));

      // Если включено "Запомнить меня", то кладем в localStorage
      if (rememberMe) {
        localStorage.setItem('authUser', JSON.stringify(userData));
      }

      // Переходим на главную страницу (или куда нужно)
      navigate('/');
    } catch (err) {
      console.error('Ошибка авторизации:', err?.response?.data || err.message);
      // Тут можно добавить вывод ошибки на экран, alert, тост и т.д.
    }
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
