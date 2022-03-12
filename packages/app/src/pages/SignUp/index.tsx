import { setJwtToken, setRefreshToken } from "@/utils/jwt";
import { useSignUpMutation, useWhoAmIQuery } from "@/__generated__/graphqlTypes";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  useWhoAmIQuery({}, {
    onSuccess: (data) => {
      if (data.whoami) {
        navigate('/');
      }
    }
  });
  const client = useQueryClient();
  const { mutate, isLoading, error } = useSignUpMutation<Error>({
    onSuccess: (data) => {
      setJwtToken(data.signupUser.jwt);
      setRefreshToken(data.signupUser.refreshToken);

      // refresh WhoAmI query after setting tokens
      client.invalidateQueries(["WhoAmI"]);

      navigate("/");
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
        {error && <div className="error">{error.message || 'Something went wrong!'}</div>}
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
        Already have an account, <Link to="/sign-in">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
