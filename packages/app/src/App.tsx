import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Demo from "./pages/Demo";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter basename="time-slot">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/demo" element={<Demo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
