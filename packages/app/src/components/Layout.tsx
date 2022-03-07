import { LOGOUT } from "@/graphql/queries";
import { Logout } from "@/graphql/__generated__/Logout";
import { setJwtToken, setRefreshToken } from "@/lib/Apollo/auth";
import useStore from "@/store/useStore";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

const Layout = ({ children }: { children: ReactNode }) => {
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const client = useApolloClient();
  const navigate = useNavigate();
  const [logout] = useLazyQuery<Logout>(LOGOUT, {
    onCompleted: async () => {
      try {
        setJwtToken("");
        setRefreshToken("");
        await client.resetStore();
        clearUser();
        navigate("/");
      } catch (err) {
        console.error(err);
      } finally {
        clearUser();
        navigate("/");
      }
    },
  });
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header>
        <div>Profile: {user?.name || "Guest"}</div>
        {user?.name && <button onClick={handleLogout}>log out</button>}
      </header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};

export default Layout;
