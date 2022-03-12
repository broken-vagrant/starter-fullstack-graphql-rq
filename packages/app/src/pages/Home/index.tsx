import {
  useGetAllUsersQuery,
  useWhoAmIQuery
} from "@/__generated__/graphqlTypes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./index.module.css";

const LoadUsers = () => {
  const [triggerQuery, setTriggerQuery] = useState(false);
  const { data, error, isLoading } = useGetAllUsersQuery(
    {},
    {
      enabled: triggerQuery,
      onError: (err: Error) => {
        console.error(err);
      },
    }
  );
  const getAllUsers = () => {
    if (!triggerQuery) {
      setTriggerQuery(true);
    }
  };
  return (
    <div className={classes.container}>
      <i>Welcome to Demo!</i>
      <button onClick={getAllUsers}>Load users</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <ul>
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
  const { data: user } = useWhoAmIQuery(undefined, {
    onSuccess: (data) => {
      if (!data?.whoami) {
        navigate('/sign-in');
      }
    }
  });

  return (
    <div className={classes.container}>
      {user?.whoami?.name && (
        <LoadUsers />
      )}
    </div>
  );
};

export default Demo;
