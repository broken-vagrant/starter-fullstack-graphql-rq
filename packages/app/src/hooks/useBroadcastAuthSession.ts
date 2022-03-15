import { sessionChannel, SessionChannelActions } from '@/lib/broadcast';
import { useCallback, useEffect } from 'react';
import { QueryClient } from 'react-query';

const useBroadcastAuthSession = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
  const handleChannel = useCallback(
    (msg: SessionChannelActions) => {
      {
        console.log({ msg });

        switch (msg.type) {
          case 'new-user':
            sessionChannel.postMessage({
              type: 'session-data',
              payload: JSON.stringify(sessionStorage),
            });
            break;
          case 'session-data':
            try {
              if (msg.payload) {
                const data = JSON.parse(msg.payload);
                for (const key in data) {
                  sessionStorage.setItem(key, data[key]);
                }
                queryClient.invalidateQueries(['WhoAmI']);
              }
            } catch (err) {
              console.error(err);
            }
            break;
          case 'set-jwt':
            sessionStorage.setItem('jwt', msg.payload);
            queryClient.invalidateQueries(['WhoAmI']);
            break;
          case 'set-refreshToken':
            sessionStorage.setItem('refreshToken', msg.payload);
            queryClient.invalidateQueries(['WhoAmI']);
            break;
          case 'logout':
            sessionStorage.clear();
            break;
          default:
            break;
        }
      }
    },
    [queryClient]
  );
  useEffect(() => {
    sessionChannel.addEventListener('message', handleChannel);

    if (!sessionStorage.length) {
      sessionChannel.postMessage({
        type: 'new-user',
      });
    }
    () => {
      sessionChannel.removeEventListener('message', handleChannel);
    };
  }, []);
};

export default useBroadcastAuthSession;
