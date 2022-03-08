import { GET_ALL_USERS } from "@/graphql/queries";
import { GetAllUsers } from "@/graphql/__generated__/GetAllUsers";
import useStore from "@/store/useStore";
import { getErrorMessage } from "@/utils";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

const LoadUsers = () => {
  const [getAllUsers, { loading, data, error }] = useLazyQuery<GetAllUsers>(
    GET_ALL_USERS,
    {
      onError: (err) => {
        console.error(err);
      },
    }
  );
  return (
    <div className={classes.container}>
      <i>That's right, this is demo hiding behind authentication.</i>
      <button onClick={() => getAllUsers()}>Load users</button>
      {loading && <div>Loading...</div>}
      {error && <div>{getErrorMessage(error)}</div>}
      {!loading && !error && (
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
  const user = useStore((state) => state.user);

  return (
    <div className={classes.container}>
      {user ? (
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
