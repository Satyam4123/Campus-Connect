import { NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
    const menu = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Announcements", path: "/announcements" },
        { name: "Resources", path: "/resources" },
        { name: "Events", path: "/events" },
        { name: "Profile", path: "/profile" },
        { name: "Department Discussion", path: "/department-discussion" },
    ];

    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 fixed h-full">
                <h1 className="text-4xl font-bold text-indigo-600 mb-10 mt-12 text-center">
                    Campus Connect
                </h1>

                <nav className="space-y-3">
                    {menu.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-gray-700 font-medium transition
                hover:bg-indigo-100 
                ${isActive ? "bg-indigo-200 text-indigo-800" : ""}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
