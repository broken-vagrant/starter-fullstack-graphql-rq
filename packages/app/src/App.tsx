import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import { useLazyQuery } from "@apollo/client";
import { WHO_AM_I } from "./graphql/queries";
import useStore from "./store/useStore";
import { WhoAmI } from "./graphql/__generated__/WhoAmI";
import { useEffect, useLayoutEffect } from "react";

const App = () => {
  const setUser = useStore((state) => state.setUser);
  const [whoami] = useLazyQuery<WhoAmI>(WHO_AM_I, {
    onCompleted: (data) => {
      console.log(data);

      setUser(data.whoami);
    },
  });
  useEffect(() => {
    (() => {
      setTimeout(async () => {
        await whoami();
      }, 1000); // TODO(check @/lib/Apollo/index.tsx): 1 sec time for sharing sessionStorage between tabs
    })();
  }, [setUser, whoami]);
  return (
    <BrowserRouter basename="react-starter">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/demo" element={<Demo />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
