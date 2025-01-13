import axios from 'axios';
import { API_URL } from './config';

const axiosInstance = axios.create({
  baseURL: API_URL, // Может быть пустым или вынести в ENV
  timeout: 10000,
});

// Пример интерцептора для добавления заголовков авторизации, если нужно
axiosInstance.interceptors.request.use(
  (config) => {
    // Если нужно авторизовать запросы:
    // const token = localStorage.getItem('access_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок ответа
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Можно добавить глобальную обработку ошибок
    return Promise.reject(error);
  }
);

export default axiosInstance;
