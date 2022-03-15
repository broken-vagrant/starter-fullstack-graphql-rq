import useBroadcastAuthSession from '@/hooks/useBroadcastAuthSession';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

interface AppProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const AppProvider = ({ children }: AppProviderProps) => {
  useBroadcastAuthSession({ queryClient });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
