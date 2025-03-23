import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import SmartCampusConnect from "./components/Body/Body";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/SmartCampusConnect" element={<SmartCampusConnect />} />
    </Routes>
  );
}

export default App;
