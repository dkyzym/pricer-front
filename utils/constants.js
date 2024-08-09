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
  { name: 'ЮГ', shortName: 'ЮГ', color: 'error' },
  { name: 'TurboCars', shortName: 'TC', color: 'secondary' },
  { name: 'Патриот', shortName: 'ПТ', color: 'success' },
  { name: 'Armtek', shortName: 'AR', color: 'primary' },
  { name: 'Orion', shortName: 'OR', color: 'warning' },
];
