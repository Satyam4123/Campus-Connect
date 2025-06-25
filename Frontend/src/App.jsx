import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Announcements from './pages/Announcements'
import Events from "./pages/Events";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/events" element={<Events />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
