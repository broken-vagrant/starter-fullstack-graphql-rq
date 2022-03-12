import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env["VITE_FRONTEND_BASENAME"] || "/"}>
      <Layout>
        <Routes>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
