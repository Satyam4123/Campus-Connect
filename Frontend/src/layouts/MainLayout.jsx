import { NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
    const menu = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Announcements", path: "/announcements" },
        { name: "Resources", path: "/resources" },
        { name: "Events", path: "/events" },
        { name: "Profile", path: "/profile" },
        
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6">
                <h2 className="text-4xl font-bold text-indigo-600 mb-8 text-center">Smart Campus Connect</h2>
                <nav className="space-y-4">
                    {menu.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-indigo-100 ${isActive ? "bg-indigo-200 text-indigo-800" : ""
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
