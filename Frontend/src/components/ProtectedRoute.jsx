import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading"); // loading | ok | fail

  useEffect(() => {
    if (!API_URL) {
      setStatus("fail");
      return;
    }

    let cancelled = false;

    const finishBootstrap = (res) => {
      const d = res.data?.data;
      if (res.data?.success && d?.userId) {
        localStorage.setItem("userId", String(d.userId));
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: d.name,
            email: d.email,
            userId: d.userId,
            department: d.department,
            year: d.year,
          })
        );
        setStatus("ok");
      } else {
        setStatus("fail");
      }
    };

    axios
      .get(`${API_URL}/auth/bootstrap`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
      .then((res) => {
        if (!cancelled) finishBootstrap(res);
      })
      .catch(() => {
        if (!cancelled) setStatus("fail");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "fail") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
