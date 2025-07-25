import { useState, useEffect } from "react";
import { Search, X, Plus } from "lucide-react";
import axios from "axios";

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/announcements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnnouncements(res.data);
                setFilteredAnnouncements(res.data);
            } catch (err) {
                console.error("Error fetching announcements", err);
            }
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                const lower = searchQuery.toLowerCase();
                setFilteredAnnouncements(
                    announcements.filter(
                        (a) =>
                            a.title.toLowerCase().includes(lower) ||
                            a.content.toLowerCase().includes(lower)
                    )
                );
            } else {
                setFilteredAnnouncements(announcements);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, announcements]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/announcements/add`,
                {
                    ...newAnnouncement,
                    author: user.name || "Unknown",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setAnnouncements((prev) => [res.data.newAnnouncement, ...prev]);
            setFilteredAnnouncements((prev) => [res.data.newAnnouncement, ...prev]);
            setNewAnnouncement({ title: "", content: "" });
            setShowModal(false);
        } catch (err) {
            console.error("Error creating announcement", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            {/* Search */}
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search announcements..."
                        className="w-full pl-10 pr-8 py-2 bg-gray-100 text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                        <X
                            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                            size={18}
                            onClick={() => setSearchQuery("")}
                        />
                    )}
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                    <Plus size={18} /> Create
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredAnnouncements.length === 0 ? (
                    <p className="text-gray-500">No announcements found.</p>
                ) : (
                    filteredAnnouncements.map((a) => (
                        <div key={a._id} className="border text-black p-4 rounded-md bg-white shadow-sm">
                            <h3 className="text-lg font-bold">{a.title}</h3>
                            <p className="text-gray-600 mt-1">{a.content}</p>
                            <p className="text-sm text-gray-400 mt-2">By {a.author} on {new Date(a.date).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-blue-600">Create Announcement</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="text-black">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newAnnouncement.title}
                                onChange={(e) =>
                                    setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
                                }
                                className="w-full mb-3 px-3 py-2 border rounded focus:outline-none"
                                required
                            />
                            <textarea
                                placeholder="Content"
                                rows="4"
                                value={newAnnouncement.content}
                                onChange={(e) =>
                                    setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))
                                }
                                className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating..." : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
