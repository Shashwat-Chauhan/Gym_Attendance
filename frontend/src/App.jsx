// import Navbar from './components/navbar'
import Home from "./pages/Home";
import MarkAttendance from "./pages/MarkAttendance";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/" element={<Signin />}></Route>
          <Route path="/mark-attendance" element={<MarkAttendance/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
