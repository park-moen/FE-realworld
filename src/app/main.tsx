import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupApi } from '~shared/api/api.interceptors';
import App from '~app/app';

setupApi().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
