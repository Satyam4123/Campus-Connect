import React, { useState } from 'react';
import { Button, TextField, Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CalendarToday, Home, Message, Search, Person } from '@mui/icons-material'; // Material icons
import './Body.css';

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
            <TextField variant="outlined"  className="search-input" size="small" />
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
  const announcements = [
    { id: 1, title: "Campus Cleanup Drive", content: "Join us this Saturday for a campus-wide cleanup initiative.", date: "2024-03-15" },
    { id: 2, title: "New Library Hours", content: "The central library will now be open 24/7 during exam weeks.", date: "2024-03-14" },
    { id: 3, title: "Guest Lecture Series", content: "Don't miss our upcoming guest lecture on AI and its applications in modern engineering.", date: "2024-03-13" },
  ];

  return (
    <div className="announcements">
      <h2 className="announcements-title">Announcements</h2>
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="announcement-card">
          <CardHeader>
            <Typography variant="h6">{announcement.title}</Typography>
            <Typography variant="body2" color="textSecondary">{announcement.date}</Typography>
          </CardHeader>
          <CardContent>
            <Typography variant="body1">{announcement.content}</Typography>
          </CardContent>
        </Card>
      ))}
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
