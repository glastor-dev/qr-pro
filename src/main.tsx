import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWithWhatsApp from './AppWithWhatsApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithWhatsApp />
  </StrictMode>,
);
