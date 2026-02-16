import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resourcesCnt, setResourcesCnt] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [eventsCnt, setEventsCnt] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  


  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { name, department, year } = user;

  useEffect(() => {
    if (announcements.length <= 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 2 >= announcements.length ? 0 : prev + 2
      );
    }, 6000); // 6 seconds per group

    return () => clearInterval(interval);
  }, [announcements]);


  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      try {
        const res1 = await axios.get(
          `${import.meta.env.VITE_API_URL}/resources/count/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResourcesCnt(res1.data.count);

        const res2 = await axios.get(
          `${import.meta.env.VITE_API_URL}/events/getCnt/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEventsCnt(res2.data.count);

        const res3 = await axios.get(
          `${import.meta.env.VITE_API_URL}/announcements`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const latestFive = res3.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setAnnouncements(latestFive);

      } catch (error) {
        console.error("Dashboard fetch error", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="h-full bg-gray-100 px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              Welcome back, {name || "User"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {department || "Department"} • Year {year || "--"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FeatureCard
            title="Resources"
            count={resourcesCnt}
            buttonText="Explore"
            onClick={() => navigate("/resources")}
          />

          <FeatureCard
            title="Events"
            count={eventsCnt}
            buttonText="View"
            onClick={() => navigate("/events")}
          />
        </div>

        {/* Latest 5 Announcements */}
        <div className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-lg p-4">
          <h3 className="text-gray-800 font-semibold mb-3 text-sm uppercase tracking-wide">
            Latest Announcements
          </h3>

          {announcements.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No announcements available.
            </p>
          ) : (
            <div className="relative h-28 overflow-hidden">
              <div
                className="transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateY(-${currentIndex * 56}px)`
                }}
              >
                {announcements.map((item) => (
                  <div
                    key={item._id}
                    className="h-14 flex flex-col justify-center border-b last:border-none"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.title}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-1">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );

};

const FeatureCard = ({ title, count, buttonText, onClick }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex items-center justify-between">

    <div>
      <h2 className="text-lg font-semibold text-gray-700">
        {title}
      </h2>
      <p className="text-2xl font-bold text-indigo-600 mt-1">
        {count}
      </p>
    </div>

    <button
      onClick={onClick}
      className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      {buttonText}
    </button>

  </div>
);

export default Dashboard;
