import "./App.css";
import * as React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { GetAllUsers } from "./__generated__/GetAllUsers";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      name
      id
    }
  }
`;
function App() {
  // GraphQL API
  const [users, setUsers] = React.useState<GetAllUsers["allUsers"] | []>([]);
  const [runQuery, { loading, data }] = useLazyQuery<GetAllUsers>(
    GET_ALL_USERS,
    { onCompleted: () => setUsers(data?.allUsers || []) }
  );

  return (
    <div>
      <button onClick={() => runQuery()}>Load users</button>
      {loading && <div>Loding...</div>}
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <pre>{JSON.stringify(user)}</pre>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
