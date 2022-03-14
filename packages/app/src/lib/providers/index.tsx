import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactNode, useEffect } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

interface AppProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const AppProvider = ({ children }: AppProviderProps) => {
  // Taken from https://blog.guya.net/2015/06/12/sharing-sessionstorage-between-tabs-for-secure-multi-tab-authentication/
  // This is a secure way to share sessionStorage between tabs.
  if (typeof window !== 'undefined') {
    if (!sessionStorage.length) {
      // Ask other tabs for session storage
      console.log('Calling getSessionStorage');
      localStorage.setItem('getSessionStorage', String(Date.now()));
    }

    window.addEventListener('storage', (event) => {
      console.log('storage event', event);
      if (event.key == 'getSessionStorage') {
        // Some tab asked for the sessionStorage -> send it
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');
      } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
        // sessionStorage is empty -> fill it
        try {
          if (event.newValue) {
            const data = JSON.parse(event.newValue);
            for (const key in data) {
              sessionStorage.setItem(key, data[key]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
  useEffect(() => {
    setTimeout(() => {
      queryClient.invalidateQueries(['WhoAmI']);
    }, 200);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
