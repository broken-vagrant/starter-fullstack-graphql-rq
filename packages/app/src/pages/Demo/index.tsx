import {
  useGetAllUsersQuery,
  useWhoAmIQuery,
} from "@/__generated__/graphqlTypes";
import { useState } from "react";
import { Link } from "react-router-dom";
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
      <i>That's right, this is demo hiding behind authentication.</i>
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
  const { data } = useWhoAmIQuery();

  return (
    <div className={classes.container}>
      {data?.whoami?.name ? (
        <LoadUsers />
      ) : (
        <div>
          To Load Users you need to <Link to="/">Sign in</Link>.
        </div>
      )}
    </div>
  );
};

export default Demo;
