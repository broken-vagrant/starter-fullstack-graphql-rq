import { LOGIN } from "@/graphql/mutations";
import { Login, LoginVariables } from "@/graphql/__generated__/Login";
import { setJwtToken, setRefreshToken } from "@/lib/Apollo/auth";
import { getErrorMessage } from "@/utils";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function App() {
  // GraphQL API
  const client = useApolloClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, data, error }] = useLazyQuery<Login, LoginVariables>(
    LOGIN
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    client.resetStore();
    await login({
      variables: {
        email,
        password,
      },
    });
    if (data?.login != null) {
      setJwtToken(data.login.jwt);
      setRefreshToken(data.login.refreshToken as string);
    }
    navigate("/demo");
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
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit">Login</button>
      </form>
      {loading && <div>Processing... </div>}
      {error && <div>{getErrorMessage(error)}</div>}
      {!loading && !error && <pre>{JSON.stringify(data?.login, null, 2)}</pre>}
      <Link to="/signup">Sign up</Link>
    </div>
  );
}

export default App;
