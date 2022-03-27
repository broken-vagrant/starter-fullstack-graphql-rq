import { tokenRefresher } from '@/lib/auth';
import { setJwtToken, setRefreshToken } from '@/utils/jwt';
import {
  useSignUpMutation,
  useWhoAmIQuery,
} from '@/__generated__/graphqlTypes';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const { data } = useWhoAmIQuery(undefined);
  useEffect(() => {
    if (data?.whoami) {
      navigate('/');
    }
  }, [data]);

  const client = useQueryClient();
  const { mutate, isLoading, error } = useSignUpMutation<Error>({
    onSuccess: async (data) => {
      // reset tokenRefresher data
      tokenRefresher.reset();

      setJwtToken(data.signupUser.jwt);
      setRefreshToken(data.signupUser.refreshToken);

      await client.invalidateQueries(['WhoAmI']);

      navigate('/');
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
    <div className="flex flex-col items-center mx-auto md:max-w-[300px]">
      <h2 className="text-2xl font-bold">SignUp</h2>
      <form onSubmit={handleSubmit} className="my-8 w-full">
        {error && (
          <div className="mt-8 error">
            {error.message || 'Something went wrong!'}
          </div>
        )}
        <div>
          <input
            type="text"
            name="name"
            placeholder="name"
            autoComplete="name"
            className="base-input"
          />
        </div>
        <div className="mt-8">
          <input
            type="email"
            name="email"
            placeholder="email"
            autoComplete="username"
            className="base-input"
          />
        </div>
        <div className="mt-8">
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            className="base-input"
          />
        </div>
        <button className="teal-btn mt-8" type="submit">
          {isLoading ? 'processing...' : 'Sign Up'}
        </button>
      </form>
      <div>
        Already have an account,{' '}
        <Link to="/sign-in" className="link">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
