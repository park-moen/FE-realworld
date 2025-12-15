import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupApi } from '~shared/api/api.interceptors';

async function bootstrap() {
  await setupApi();

  const { default: App } = await import('~app/app');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
