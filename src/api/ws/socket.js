import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  autoConnect: true,
  reconnection: true,
});

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  GET_ITEM_RESULTS: 'getItemResults',
  BRAND_CLARIFICATION: 'getBrandClarification',
  BRAND_CLARIFICATION_RESULTS: 'brandClarificationResults',
  BRAND_CLARIFICATION_ERROR: 'brandClarificationError',
  SUPPLIER_DATA_FETCH_STARTED: 'supplierDataFetchStarted',
  SUPPLIER_DATA_FETCH_SUCCESS: 'supplierDataFetchSuccess',
  SUPPLIER_DATA_FETCH_ERROR: 'supplierDataFetchError',
  ADD_TO_CART_REQUEST: 'addToCartRequest',
  ADD_TO_CART_SUCCESS: 'addToCartSuccess',
  ADD_TO_CART_ERROR: 'addToCartError',
  SESSIONS_CREATED: 'sessionsCreated',
  SESSIONS_ERROR: 'sessionsError',
};
