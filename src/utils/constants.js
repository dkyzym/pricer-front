import { API_URL } from '@api/config';

export const CREDENTIALS = {
  ЮГ: {
    username: 'automir.lg@gmail.com',
    password: '954712',
    loginUrl: `${API_URL}login/ug`,
    logoutUrl: `${API_URL}logout/ug`,
  },
  TurboCars: {
    username: '32831',
    password: '12345678',
    loginUrl: `${API_URL}login/tc`,
    logoutUrl: `${API_URL}logout/tc`,
  },
  Патриот: {
    username: 'automir.lg@gmail.com',
    password: '296942aA',
    loginUrl: `${API_URL}login/pt`,
    logoutUrl: `${API_URL}logout/pt`,
  },
  Orion: {
    username: 'automir.19@yandex.ru',
    password: '296942',
    loginUrl: `${API_URL}login/or`,
    logoutUrl: `${API_URL}logout/or`,
  },
  Armtek: {
    username: 'automir.lg@gmail.com',
    password: '296942',
    loginUrl: `${API_URL}login/ar`,
    logoutUrl: `${API_URL}logout/ar`,
  },
  profit: {
    addToCartURL: `${API_URL}/api/cart/add`,
  },
};
