import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext";

const API_BASE = `${import.meta.env.VITE_API_URL}/department-discussion`;

export default function DepartmentDiscussion() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const [department, setDepartment] = useState("");
  const scrollRef = useRef(null);
  const { socket } = useSocket();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
        setDepartment(res.data.department || "");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load discussion");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchMessages();
  }, [token]);

  // Real-time updates with socket.io
  useEffect(() => {
    if (!socket || !department) return;

    socket.emit("join-department", department);

    socket.on("new_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("new_message");
      socket.emit("leave-department", department);
    };
  }, [socket, department]);

  // Polling as fallback for real-time updates (every 3 seconds)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !token || posting) return;

    setPosting(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE}/messages`,
        { text: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success && res.data.data?.message) {
        setMessages((prev) => [...prev, res.data.data.message]);
        setText("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post message");
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";
  };

  if (!userId || !token) {
    return (
      <div className="p-6 text-gray-600">
        Please log in to view the department discussion.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-semibold text-gray-800">
          Department Discussion
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {department ? `${department} channel — text-only, all messages retained` : "Loading..."}
        </p>
      </div>

      {error && (
        <div className="mx-4 mt-2 px-4 py-2 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Start the discussion!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId?._id === userId;
            return (
              <div
                key={msg._id}
                className={`flex gap-2 ${isMe ? "flex-row-reverse justify-end" : "justify-start"}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {msg.userId?.profilePic ? (
                    <img
                      src={msg.userId.profilePic}
                      alt={msg.userId?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center border border-gray-300">
                      {getInitials(msg.userId?.name)}
                    </div>
                  )}
                </div>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <p className={`text-xs font-medium text-gray-600 mb-1`}>
                    {msg.userId?.name || "Unknown"}
                    {isMe && " (you)"}
                  </p>
                  <p
                    className={`px-4 py-2 rounded-lg text-sm max-w-xs break-words ${isMe
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 text-gray-800"
                      }`}
                  >
                    {msg.text}
                  </p>
                  <p className={`text-xs text-gray-400 mt-1`}>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!text.trim() || posting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {posting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
