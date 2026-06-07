import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource/geist-mono';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/shell.css';
import { AppState } from './AppState';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Root container missing in index.html');
}

createRoot(container).render(
  <StrictMode>
    <AppState />
  </StrictMode>,
);
