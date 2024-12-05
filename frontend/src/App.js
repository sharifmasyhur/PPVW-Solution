import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import Donation from "./pages/Donation";
import Profile from "./pages/Profile";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/signup", "/logout"];
  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {isSidebarVisible && <Sidebar />} {/* Tampilkan Sidebar jika rutenya bukan Login atau SignUp */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report" element={<Report />} />
          <Route path="/logout" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;