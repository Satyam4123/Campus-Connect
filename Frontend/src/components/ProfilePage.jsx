import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // You need to store userId when logging in
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [deletePassword, setDeletePassword] = useState('');
  const [message, setMessage] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(userId)
        const res = await axios.get(`http://localhost:3000/profile/${userId}`, { headers });
        console.log('Profile data:', res.data); // Log the response
        setProfile(res.data);
        setEditData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err.response?.data || err.message);
        setMessage(err.response?.data?.message || 'Error fetching profile');
        setLoading(false);
      }
    };

    if (userId && token) {
      console.log("hello")
      fetchProfile();
    } else {
      setMessage('User not authenticated');
      setLoading(false);
    }
  }, []);

  // Edit profile
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3000/profile/edit', editData, { headers });
      setMessage('Profile updated!');
      // Refresh profile data
      const res = await axios.get(`http://localhost:3000/profile/${user._id}`, { headers });
      setProfile(res.data);
      setShowEdit(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (!deletePassword) {
      setMessage('Please enter your password');
      return;
    }

    try {
      await axios.delete('http://localhost:3000/profile/delete', {
        headers,
        data: { password: deletePassword }
      });
      setMessage('Account deleted!');
      localStorage.clear();
      window.location.href = '/'; // Redirect to home
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="p-6 max-w-xl mx-auto">Loading...</div>;
  if (!profile) return <div className="p-6 max-w-xl mx-auto">Profile not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {message && (
        <p className={`text-sm mb-2 ${message.includes('!') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      {/* Profile Display */}
      <div className=" p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-lg mb-2">Profile Information</h3>
        <p><span className="font-medium">Name:</span> {profile.name}</p>
        <p><span className="font-medium">Department:</span> {profile.department}</p>
        <p><span className="font-medium">Year:</span> {profile.year}</p>
      </div>

      {/* Edit Profile (Conditional) */}
      <div className="mb-6">
        <button
          onClick={() => setShowEdit(!showEdit)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
        >
          {showEdit ? 'Cancel Edit' : 'Edit Profile'}
        </button>

        {showEdit && (
          <form onSubmit={handleEdit} className="space-y-3 mt-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Name"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={editData.department || ''}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={editData.year || ''}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password (leave blank to keep current)"
              onChange={(e) => setEditData({ ...editData, password: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Delete Account (Conditional) */}
      <div>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {showDelete ? 'Cancel Delete' : 'Delete Account'}
        </button>

        {showDelete && (
          <div className="mt-3 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm mb-3">This action cannot be undone. Please enter your password to confirm.</p>
            <input
              type="password"
              placeholder="Confirm Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border p-2 my-2 rounded"
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

export default ProfilePage;