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
    username: 'automir.lg@gmail.com',
    password: '296942aA',
    loginUrl: `${BASE_URL}login/pt`,
    logoutUrl: `${BASE_URL}logout/pt`,
  },
  Orion: {
    username: 'automir.19@yandex.ru',
    password: '296942',
    loginUrl: `${BASE_URL}login/or`,
    logoutUrl: `${BASE_URL}logout/or`,
  },
  Armtek: {
    username: 'automir.lg@gmail.com',
    password: '296942',
    loginUrl: `${BASE_URL}login/ar`,
    logoutUrl: `${BASE_URL}logout/ar`,
  },
  profit: {
    addToCartURL: `${BASE_URL}addToCart`,
  },
};

export const SUPPLIERS = [
  { name: 'ЮГ', shortName: 'ЮГ', color: 'error' },
  { name: 'TurboCars', shortName: 'TC', color: 'secondary' },
  { name: 'Патриот', shortName: 'ПТ', color: 'success' },
  // { name: 'Orion', shortName: 'OR', color: 'warning' },
  // { name: 'Armtek', shortName: 'AR', color: 'info' },
  // { name: 'Profit', shortName: 'PR', color: 'info' },
];

export const INITIAL_STATUSES = {
  ЮГ: false,
  TC: false,
  ПТ: false,
  // OR: false,
};

Object.seal(INITIAL_STATUSES);
