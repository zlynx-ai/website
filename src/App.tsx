import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tutorials from "./pages/Tutorials";
import Docs from "./pages/Docs";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorials/*" element={<Tutorials />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
