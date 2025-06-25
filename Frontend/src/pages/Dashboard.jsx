import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { name, department, year } = user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome back, {name || "User"} 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Department of {department || "Your Dept"}, Year {year || "--"}
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard title="Resources Shared" value="128" />
        <DashboardCard title="Events Joined" value="17" />
        <DashboardCard title="Active Connections" value="42" />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <ActivityItem text="You uploaded 'Soil Mechanics Notes'" />
          <ActivityItem text="You joined 'AI Club Meetup'" />
          <ActivityItem text="Riya Sharma sent you a connection request" />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-gray-600 text-lg">{title}</h3>
    <p className="text-indigo-600 text-2xl font-bold">{value}</p>
  </div>
);

const ActivityItem = ({ text }) => (
  <div className="text-gray-700 border-b pb-2 last:border-none">{text}</div>
);

export default Dashboard;
