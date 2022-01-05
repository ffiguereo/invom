import { QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

import { queryClient } from '../libs/react-query';
import { AuthProvider } from './auth-context';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
