import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = ({ setShowEditProfile }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the user's current profile data
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://localhost:3000/user/profile/edit", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const { name, email, department, year } = response.data;
                setName(name);
                setEmail(email);
                setDepartment(department);
                setYear(year);
            } catch (error) {
                setError("Failed to fetch user profile");
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.put(
                "http://localhost:3000/user/profile",
                { name, email, department, year },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );

            setSuccess(response.data.message); // Profile updated successfully
            setShowEditProfile(false); // Close the edit profile popup
        } catch (error) {
            setError("Failed to update profile: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="edit-profile-popup">
            <form onSubmit={handleSubmit} className="edit-profile-container">
                <h2>Edit Profile</h2>
                <div className="edit-profile-inputs">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit">Update Profile</button>
                <button type="button" onClick={() => setShowEditProfile(false)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProfile;
