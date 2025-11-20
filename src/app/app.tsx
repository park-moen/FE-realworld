import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { queryClient } from '~shared/queryClient';
import { persistor, store } from '~shared/store';
import { BootstrappedRouter } from './browser-router';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BootstrappedRouter />
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
