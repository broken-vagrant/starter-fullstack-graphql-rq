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

const SignUpPage = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [fetchUser] = useLazyQuery<WhoAmI>(WHO_AM_I, {
    onCompleted: (data) => {
      if (data.whoami) {
        setUser(data.whoami);
      }
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
    <div>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" autoComplete="name" />
        <input
          type="email"
          name="email"
          placeholder="email"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="current-password"
        />
        <button type="submit">Sign up</button>
      </form>
      {loading && <div>Processing... </div>}
      {error && <div>{getErrorMessage(error)}</div>}
      <div>
        <Link to="/">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
