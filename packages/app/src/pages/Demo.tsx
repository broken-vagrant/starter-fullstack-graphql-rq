import { GET_ALL_USERS } from "@/graphql/queries";
import { GetAllUsers } from "@/graphql/__generated__/GetAllUsers";
import useStore from "@/store/useStore";
import { getErrorMessage } from "@/utils";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const Demo = () => {
  const user = useStore((state) => state.user);
  const [getAllUsers, { loading, data, error }] =
    useLazyQuery<GetAllUsers>(GET_ALL_USERS);
  if (!user) {
    return (
      <div>
        To view demo you need to <Link to="/">Sign in</Link>.
      </div>
    );
  }

  return (
    <div>
      <h2>Load users</h2>
      <button onClick={() => getAllUsers()}>Load users</button>
      {loading && <div>Loding...</div>}
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

export default Demo;
