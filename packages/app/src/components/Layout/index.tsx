import { setJwtToken, setRefreshToken } from "@/utils/jwt";
import useStore from "@/store/useStore";
import {
  useLogoutMutation,
  useWhoAmIQuery,
} from "@/__generated__/graphqlTypes";
import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import classes from "./index.module.css";

const Layout = ({ children }: { children: ReactNode }) => {
  const [enableWhoAmI, setEnableWhoAmI] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setEnableWhoAmI(true);
    }, 200);
  }, []);
  const { data } = useWhoAmIQuery(
    {},
    {
      enabled: enableWhoAmI,
    }
  );

  const clearUser = useStore((state) => state.clearUser);
  const navigate = useNavigate();
  const client = useQueryClient();
  const { mutate } = useLogoutMutation({
    onSuccess: () => {
      try {
        setJwtToken("");
        setRefreshToken("");
        client.clear();
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
  const handleLogout = () => {
    mutate({});
  };

  return (
    <>
      <header className={classes.header}>
        <Link to="/">
          <h1>Auth Demo</h1>
        </Link>
        <div className={classes.profile}>
          <div>Profile: {data?.whoami?.name || "Guest"}</div>
          {data?.whoami?.name && (
            <button onClick={handleLogout}>log out</button>
          )}
        </div>
      </header>
      <main className={classes.main}>{children}</main>
      <footer className={classes.footer}>Footer</footer>
    </>
  );
};

export default Layout;
