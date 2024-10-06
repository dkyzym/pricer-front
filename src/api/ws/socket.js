import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  autoConnect: true,
  reconnection: true,
});

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  AUTOCOMPLETE: 'autocomplete',
  AUTOCOMPLETE_RESULTS: 'autocompleteResults',
  AUTOCOMPLETE_ERROR: 'autocompleteError',
  GET_ITEM_RESULTS: 'getItemResults',
  GET_ITEM_RESULTS_DATA: 'getItemResultsData',
  BRAND_CLARIFICATION: 'getBrandClarification',
  BRAND_CLARIFICATION_RESULTS: 'brandClarificationResults',
  BRAND_CLARIFICATION_ERROR: 'brandClarificationError',
};
