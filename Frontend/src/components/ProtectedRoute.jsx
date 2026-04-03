import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/** Read JWT from OAuth redirect (#token=...) and remove it from the URL (not sent to server). */
function consumeOAuthTokenFromHash() {
  const hash = window.location.hash;
  if (!hash.startsWith("#token=")) return;
  try {
    const token = decodeURIComponent(hash.slice(7));
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch {
    /* ignore */
  }
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
}

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading"); // loading | ok | fail

  useEffect(() => {
    consumeOAuthTokenFromHash();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setStatus("ok");
      return;
    }

    if (!API_URL) {
      setStatus("fail");
      return;
    }

    let cancelled = false;

    const finishBootstrap = (res) => {
      const d = res.data?.data;
      if (res.data?.success && d?.jwtToken) {
        localStorage.setItem("token", d.jwtToken);
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

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    axios
      .get(`${API_URL}/auth/bootstrap`, {
        withCredentials: true,
        headers,
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
