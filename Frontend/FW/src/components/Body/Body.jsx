import React, { useState, useEffect } from 'react';
import { Button, TextField, Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CalendarToday, Home, Message, Search, Person } from '@mui/icons-material';
import './Body.css';
import axios from 'axios';

export default function Body() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AnnouncementsFeed />;
      case 'events':
        return <EventsCalendar />;
      case 'messages':
        return <MessagingSystem />;
      case 'resources':
        return <ResourceSharing />;
      case 'profile':
        return <UserProfile />;
      default:
        return <AnnouncementsFeed />;
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Smart Campus Connect</h1>
        </div>
        <ul className="sidebar-nav">
          <NavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<CalendarToday />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <NavItem icon={<Message />} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <NavItem icon={<Person />} label="Resources" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
          <NavItem icon={<Person />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </ul>
      </nav>

      <main className="main-content">
        <header className="main-header">
          <div className="search-container">
            <Search className="search-icon" />
            <TextField variant="outlined" className="search-input" size="small" />
          </div>
          <div className="header-icons">
            <Button variant="text"></Button>
            <Avatar alt="User Avatar" src="https://github.com/shadcn.png" />
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <li>
      <Button
        variant={active ? "contained" : "text"}
        className={`nav-item ${active ? "active" : ""}`}
        onClick={onClick}
        startIcon={icon}
        fullWidth
      >
        {label}
      </Button>
    </li>
  );
}

function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        if (!token) {
          setError("You are not authorized. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/announcements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setAnnouncements(response.data);
        } else {
          setError("Failed to fetch announcements.");
        }
      } catch (err) {
        setError("Failed to fetch announcements: " + (err.response?.data?.message || err.message));
      }
    };

    fetchAnnouncements();
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="announcements">
      <h2 className="announcements-title">Announcements</h2>
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <Card key={announcement.id} className="announcement-card">
            <CardHeader>
              <Typography variant="h6">{announcement.title}</Typography>
              <Typography variant="body2" color="textSecondary">{announcement.date}</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="body1">{announcement.content}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No announcements available</p>
      )}
    </div>
  );
}

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track if user is editing
  const [formData, setFormData] = useState({ name: '', email: '', department: '', year: '' });
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');  // Fetch the logged-in user's ID

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token || !userId) {
          setError("You are not authorized. Please log in.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserData(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            department: response.data.department,
            year: response.data.year,
          });
        } else {
          setError("Failed to fetch user profile.");
        }
      } catch (err) {
        setError("Failed to fetch user profile: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/profile/edit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUserData(response.data);
        setIsEditing(false);
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      setError("Error updating profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {userData ? (
        <Card>
          <CardHeader
            avatar={<Avatar src={userData.avatar || 'https://via.placeholder.com/150'} />}
            title={isEditing ? (
              <TextField
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Name"
                fullWidth
              />
            ) : userData.name}
            subheader={userData.email}
          />
          <CardContent>
            {isEditing ? (
              <>
                <TextField
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="year"
                  label="Year"
                  value={formData.year}
                  onChange={handleInputChange}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Typography variant="body1">Department: {userData.department}</Typography>
                <Typography variant="body1">Year: {userData.year}</Typography>
              </>
            )}
          </CardContent>
          <Button onClick={handleEditToggle} variant="contained" color="primary">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveProfile} variant="contained" color="secondary">
              Save
            </Button>
          )}
        </Card>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}


function ResourceSharing() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:3000/resources", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setResources(response.data);
      } catch (err) {
        setError("Failed to load resources");
      }
    };

    fetchResources();
  }, []);

  const handleDownload = async (resourceId) => {
    try {
      const response = await axios.get(`http://localhost:3000/resources/download/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data])); 
      const a = document.createElement("a");
      a.href = url;
      a.download = response.headers["content-disposition"].split("filename=")[1]; 
      a.click();
    } catch (err) {
      setError("Failed to download resource.");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Available Resources</h2>
      {resources.length > 0 ? (
        resources.map((resource) => (
          <Card key={resource._id} className="resource-card">
            <CardHeader title={resource.title} />
            <CardContent>
              <Typography variant="body1">{resource.description}</Typography>
              <Button onClick={() => handleDownload(resource._id)}>Download</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No resources available</p>
      )}
    </div>
  );
}
