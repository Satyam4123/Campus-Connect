import React, { useState, useEffect } from 'react';
import { Button, TextField, Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CalendarToday, Home, Message, Search, Person } from '@mui/icons-material'; // Material icons
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
      {/* Sidebar */}
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

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-container">
            <Search className="search-icon" />
            <TextField variant="outlined" className="search-input" size="small" />
          </div>
          <div className="header-icons">
            <Button variant="text">
            </Button>
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

  // Get the token from localStorage or another source where it's stored
  const token = localStorage.getItem('token');  // Ensure you're using 'authToken' (check the naming consistency)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        if (!token) {
          setError("You are not authorized. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/announcements", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (response.status === 200) {
          setAnnouncements(response.data); // Assuming the server returns the announcements data
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

function EventsCalendar() {
  return <div className="placeholder-text">Events Calendar (To be implemented)</div>;
}

function MessagingSystem() {
  return <div className="placeholder-text">Messaging System (To be implemented)</div>;
}

function ResourceSharing() {
  return <div className="placeholder-text">Resource Sharing (To be implemented)</div>;
}

function UserProfile() {
  return <div className="placeholder-text">User Profile (To be implemented)</div>;
}
