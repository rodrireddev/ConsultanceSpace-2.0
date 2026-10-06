import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom no los trae y firebase los necesita al importarse.
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

if (typeof global.ReadableStream === 'undefined') {
  // eslint-disable-next-line global-require
  global.ReadableStream = require('stream/web').ReadableStream;
}
