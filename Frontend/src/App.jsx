import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import SmartCampusConnect from "./components/Body/Body";
import LoginPage from "./components/LOGIN/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/SmartCampusConnect" element={<SmartCampusConnect />} />
    </Routes>
  );
}

export default App;
