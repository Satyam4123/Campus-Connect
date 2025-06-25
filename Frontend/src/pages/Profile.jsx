import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/profile/${userId}`, { headers });
        setProfile(res.data);
        setEditData(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchProfile();
    } else {
      setMessage("User not authenticated");
      setLoading(false);
    }
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3000/profile/edit", editData, { headers });
      setMessage("Profile updated!");
      const res = await axios.get(`http://localhost:3000/profile/${userId}`, { headers });
      setProfile(res.data);
      setShowEdit(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      setMessage("Please enter your password");
      return;
    }

    try {
      await axios.delete("http://localhost:3000/profile/delete", {
        headers,
        data: { password: deletePassword },
      });
      setMessage("Account deleted!");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6 max-w-xl mx-auto text-gray-800">Loading...</div>;
  if (!profile) return <div className="p-6 max-w-xl mx-auto text-gray-800">Profile not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Profile</h2>

      {message && (
        <p className={`text-sm mb-3 ${message.includes("!") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      {/* Profile Display */}
      <div className="bg-white border p-4 rounded-lg mb-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-2 text-blue-600">Profile Information</h3>
        <p><span className="font-medium">Name:</span> {profile?.name || "-"}</p>
        <p><span className="font-medium">Department:</span> {profile?.department || "-"}</p>
        <p><span className="font-medium">Year:</span> {profile?.year || "-"}</p>
      </div>

      {/* Edit Profile */}
      <div className="mb-6">
        <button
          onClick={() => setShowEdit(!showEdit)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
        >
          {showEdit ? "Cancel Edit" : "Edit Profile"}
        </button>

        {showEdit && (
          <form onSubmit={handleEdit} className="space-y-3 mt-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Name"
              value={editData.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={editData.department || ""}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={editData.year || ""}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              className="w-full border p-2 rounded text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
              className="w-full border p-2 rounded text-gray-800"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Delete Account */}
      <div>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {showDelete ? "Cancel Delete" : "Delete Account"}
        </button>

        {showDelete && (
          <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm mb-3 text-gray-800">
              This action cannot be undone. Please enter your password to confirm.
            </p>
            <input
              type="password"
              placeholder="Confirm Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border p-2 my-2 rounded text-gray-800"
              required
            />
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Confirm Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
