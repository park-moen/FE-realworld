import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~shared/queryClient';
import { BootstrappedRouter } from './browser-router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BootstrappedRouter />
    </QueryClientProvider>
  );
}
