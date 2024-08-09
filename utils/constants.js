export const BASE_URL = 'http://localhost:3000/';

export const CREDENTIALS = {
  ЮГ: {
    username: 'automir.lg@gmail.com',
    password: '954712',
    loginUrl: `${BASE_URL}login/ug`,
    logoutUrl: `${BASE_URL}logout/ug`,
  },
  TurboCars: {
    username: '32831',
    password: '12345678',
    loginUrl: `${BASE_URL}login/tc`,
    logoutUrl: `${BASE_URL}logout/tc`,
  },
  Патриот: {
    username: '',
    password: '',
    loginUrl: '',
    logoutUrl: '',
  },
  Armtek: {
    username: '',
    password: '',
    loginUrl: '',
    logoutUrl: '',
  },
  Orion: {
    username: '',
    password: '',
    loginUrl: '',
    logoutUrl: '',
  },
};

export const SUPPLIERS = [
  { name: 'ЮГ', color: 'error' },
  { name: 'TurboCars', color: 'secondary' },
  { name: 'Патриот', color: 'success' },
  { name: 'Armtek', color: 'primary' },
  { name: 'Orion', color: 'warning' },
];
