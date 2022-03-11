import { setJwtToken, setRefreshToken } from "@/utils/jwt";
import { useSignUpMutation } from "@/__generated__/graphqlTypes";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { mutate, isLoading, error } = useSignUpMutation({
    onSuccess: (data) => {
      setJwtToken(data.signupUser.jwt);
      setRefreshToken(data.signupUser.refreshToken);

      // refresh WhoAmI query after setting tokens
      client.invalidateQueries(["WhoAmI"]);

      navigate("/demo");
    },
    onError: (err: Error) => {
      console.error(err);
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, name } = e.currentTarget.elements as any;
    mutate({
      data: {
        email: email.value,
        password: password.value,
        name: name.value,
      },
    });
  };
  return (
    <div className={classes.container}>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit} className={classes.signup_form}>
        {error && <div className="error">{error.message}</div>}
        <div>
          <input
            type="text"
            name="name"
            placeholder="name"
            autoComplete="name"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="email"
            autoComplete="username"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
      {isLoading && <div>Processing... </div>}
      <div>
        Already have an account, <Link to="/">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
