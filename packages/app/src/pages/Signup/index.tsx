import { SIGNUP } from "@/graphql/mutations";
import { WHO_AM_I } from "@/graphql/queries";
import { SignUp, SignUpVariables } from "@/graphql/__generated__/SignUp";
import { WhoAmI } from "@/graphql/__generated__/WhoAmI";
import { setJwtToken, setRefreshToken } from "@/lib/Apollo/auth";
import useStore from "@/store/useStore";
import { getErrorMessage } from "@/utils";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [fetchUser] = useLazyQuery<WhoAmI>(WHO_AM_I, {
    onCompleted: (data) => {
      if (data.whoami) {
        setUser(data.whoami);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const [signUp, { loading, error }] = useMutation<SignUp, SignUpVariables>(
    SIGNUP,
    {
      onCompleted: async (data) => {
        setJwtToken(data.signupUser.jwt);
        setRefreshToken(data.signupUser.refreshToken);
        await fetchUser();
        navigate("/demo");
      },
      onError: (err) => {
        console.error(err);
      },
    }
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, name } = e.currentTarget.elements as any;
    await signUp({
      variables: {
        data: {
          email: email.value,
          password: password.value,
          name: name.value,
        },
      },
    });
  };
  return (
    <div className={classes.container}>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit} className={classes.signup_form}>
        {error && <div className="error">{getErrorMessage(error)}</div>}
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
      {loading && <div>Processing... </div>}
      <div>
        Already have an account, <Link to="/">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
