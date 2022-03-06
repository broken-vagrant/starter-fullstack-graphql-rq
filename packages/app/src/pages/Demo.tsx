import { GET_ALL_USERS } from "@/graphql/queries";
import { GetAllUsers } from "@/graphql/__generated__/GetAllUsers";
import { useLazyQuery } from "@apollo/client";
import { useState } from "react";

const Demo = () => {
  const [users, setUsers] = useState<GetAllUsers["allUsers"] | []>([]);
  const [getAllUsers, { loading: allUsersLoading, data: allUsersData }] =
    useLazyQuery<GetAllUsers>(GET_ALL_USERS, {
      onCompleted: () => setUsers(allUsersData?.allUsers || []),
    });
  return (
    <div>
      <h2>Load users</h2>
      <button onClick={() => getAllUsers()}>Load users</button>
      {allUsersLoading && <div>Loding...</div>}
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
};

export default Demo;
