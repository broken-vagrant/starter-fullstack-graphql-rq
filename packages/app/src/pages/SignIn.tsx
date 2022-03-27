import { tokenRefresher } from '@/lib/auth';
import { setJwtToken, setRefreshToken } from '@/utils/jwt';
import { useLoginMutation, useWhoAmIQuery } from '@/__generated__/graphqlTypes';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function App() {
  // GraphQL API
  const navigate = useNavigate();
  const { data } = useWhoAmIQuery(undefined);
  useEffect(() => {
    if (data?.whoami) {
      navigate('/');
    }
  }, [data]);
  const client = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, error, isLoading } = useLoginMutation<Error>({
    onSuccess: async (data) => {
      if (data.login) {
        // reset tokenRefresher data
        tokenRefresher.reset();

        // set tokens
        setJwtToken(data.login?.jwt);
        setRefreshToken(data.login?.refreshToken as string);

        // refresh WhoAmI query after setting tokens
        await client.invalidateQueries(['WhoAmI']);

        navigate('/');
      }
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
    <div className="flex flex-col items-center mx-auto md:max-w-[300px]">
      <h2 className="m-1 text-2xl font-extrabold">Login</h2>
      <form onSubmit={handleSubmit} className="my-8 w-full">
        {error && (
          <div className="error">
            {error.message || 'Something went wrong!'}
          </div>
        )}
        <div>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="username"
            required
            className="base-input"
          />
        </div>
        <div className="mt-8">
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="base-input"
          />
        </div>
        <button type="submit" className="teal-btn mt-8">
          {isLoading ? 'logging in...' : 'Login'}
        </button>
      </form>
      <div>
        Don't have account,{' '}
        <Link to="/sign-up" className="link">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default App;
