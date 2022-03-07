import { LOGIN } from "@/graphql/mutations";
import { WHO_AM_I } from "@/graphql/queries";
import { Login, LoginVariables } from "@/graphql/__generated__/Login";
import { WhoAmI } from "@/graphql/__generated__/WhoAmI";
import { setJwtToken, setRefreshToken } from "@/lib/Apollo/auth";
import useStore from "@/store/useStore";
import { getErrorMessage } from "@/utils";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function App() {
  // GraphQL API
  const client = useApolloClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useStore((state) => state.setUser);
  const [fetchUser] = useLazyQuery<WhoAmI>(WHO_AM_I, {
    onCompleted: (data) => {
      if (data.whoami) {
        setUser(data.whoami);
      }
    },
  });
  const [login, { loading, error }] = useMutation<Login, LoginVariables>(
    LOGIN,
    {
      onCompleted: async (data) => {
        if (data?.login != null) {
          setJwtToken(data.login.jwt);
          setRefreshToken(data.login.refreshToken as string);
          await fetchUser();
          navigate("/demo");
        }
      },
    }
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await client.resetStore();
    await login({
      variables: {
        email,
        password,
      },
    });
  };
  return (
    <div className="App">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="username"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Login</button>
      </form>
      {loading && <div>Processing... </div>}
      {error && <div>{getErrorMessage(error)}</div>}
      <Link to="/signup">Sign up</Link>
    </div>
  );
}

export default App;
