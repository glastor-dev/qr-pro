// Polyfills for libraries used in the app (e.g., jsPDF) when running in Jest/jsdom
// Kept as ESM (.js) for compatibility with tooling that may reference this path.
import { TextDecoder, TextEncoder } from 'util';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder;
}
