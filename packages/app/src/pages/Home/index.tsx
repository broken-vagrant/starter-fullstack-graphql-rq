import { setJwtToken, setRefreshToken } from "@/utils/jwt";
import { useLoginMutation } from "@/__generated__/graphqlTypes";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

function App() {
  // GraphQL API
  const client = useQueryClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, error, isLoading } = useLoginMutation({
    onSuccess: async (data) => {
      if (data.login) {
        // set tokens
        setJwtToken(data.login?.jwt);
        setRefreshToken(data.login?.refreshToken as string);

        // refresh WhoAmI query after setting tokens
        await client.invalidateQueries(["WhoAmI"]);

        navigate("/demo");
      }
    },
    onError: (err: Error) => {
      console.error(err.message);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    client.clear();
    mutate({
      email,
      password,
    });
  };
  return (
    <div className={classes.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={classes.login_form}>
        {error && <div className="error">{error.message}</div>}
        <div>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit">{isLoading ? "logging in..." : "Login"}</button>
      </form>
      <div>
        Don't have account, <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

export default App;
