import {
  useGetAllUsersQuery,
  useWhoAmIQuery,
} from '@/__generated__/graphqlTypes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadUsers = () => {
  const [triggerQuery, setTriggerQuery] = useState(false);
  const { data, error, isLoading } = useGetAllUsersQuery(undefined, {
    enabled: triggerQuery,
    onError: (err: Error) => {
      console.error(err);
    },
  });
  const getAllUsers = () => {
    if (!triggerQuery) {
      setTriggerQuery(true);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="m-1 text-2xl font-extrabold">Welcome to Demo!</h2>
      <button onClick={getAllUsers} className="teal-btn">
        Load users
      </button>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <ul className="mt-8">
          {data?.allUsers.map((user) => {
            return (
              <li key={user.id}>
                <pre>{JSON.stringify(user)}</pre>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
const Demo = () => {
  const navigate = useNavigate();
  const { data } = useWhoAmIQuery(undefined, {
    staleTime: 30 * 1000,
    onError: () => {
      navigate('/sign-in');
    },
  });
  useEffect(() => {
    if (!data?.whoami) {
      navigate('/sign-in');
    }
  },[data])

  return <section>{data?.whoami?.name && <LoadUsers />}</section>;
};

export default Demo;
