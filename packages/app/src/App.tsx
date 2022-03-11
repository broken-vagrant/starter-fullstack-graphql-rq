import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import SignUp from "./pages/Signup";
import Layout from "./components/Layout";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env["VITE_FRONTEND_BASENAME"] || "/"}>
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
