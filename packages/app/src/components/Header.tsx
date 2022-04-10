import React from 'react';
import { tokenRefresher } from '@/lib/auth';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { sessionChannel } from '@/lib/broadcast';
import { setJwtToken, setRefreshToken } from '@/utils/jwt';
import {
  useLogoutMutation,
  useWhoAmIQuery,
} from '@/__generated__/graphqlTypes';
import { Link } from 'react-router-dom';
import MobileNavMenu from './mobile/MobileNavMenu';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data } = useWhoAmIQuery(undefined);
  const navigate = useNavigate();
  const client = useQueryClient();
  const { mutate } = useLogoutMutation({
    onSuccess: async () => {
      try {
        setJwtToken('');
        setRefreshToken('');
        client.clear();
        sessionStorage.clear();
        await sessionChannel.postMessage({ type: 'logout' });
        navigate('/');
        tokenRefresher.reset();
      } catch (err) {
        console.error(err);
      } finally {
        navigate('/');
      }
    },
  });
  const handleLogout = () => {
    mutate({});
  };
  return (
    <header className="py-4 px-2 lg:px-0 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-black font-font-extrabold underline">
          Auth Demo
        </h1>
      </Link>
      <nav className="">
        <div className="block md:hidden">
          <MobileNavMenu profile={data?.whoami} handleLogout={handleLogout} />
        </div>
        <ul className="md:flex hidden flex items-center gap-4">
          <li>
            <Link to="/about" className="underline">
              about
            </Link>
          </li>
          <li>
            <Link to="/sign-in" className="underline">
              sign-in
            </Link>
          </li>
          <li>
            <Link to="/sign-up" className="underline">
              sign-up
            </Link>
          </li>
          <li>
            Profile: <strong>{data?.whoami?.name || 'Guest'}</strong>
          </li>
          <li>
            {data?.whoami?.name && (
              <button onClick={handleLogout} className="ml-4 teal-btn">
                log out
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
