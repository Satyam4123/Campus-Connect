import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LOGIN/login";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;