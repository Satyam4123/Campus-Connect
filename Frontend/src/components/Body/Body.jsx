import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Calendar, ChevronLeft, ChevronRight, Eye, FileText, Folder, Home, MessageCircle, Plus, Search, Trash, User, X, Edit3 } from "lucide-react";
import "./Body.css";

export default function SmartCampusConnect() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [editAnnouncementId, setEditAnnouncementId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [events, setEvents] = useState({});
  const [user, setUser] = useState(null); // Add user state

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const addResource = (type) => {
    const newResource = {
      id: Date.now(),
      name: type === "folder" ? "New Folder" : "New File",
      type,
      addedBy: user.name || "Current User", // Use the logged-in user's name
      dateAdded: new Date(),
    };
    setResources([...resources, newResource]);
  };

  const deleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const viewResource = (resource) => {
    alert(`Viewing ${resource.type}: ${resource.name}`);
    // In a real app, this would open the file or show folder contents
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    // Show sliding window popup
    alert(`To be implemented: ${section}`);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadNotifications > 0) {
      setUnreadNotifications(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  const addAnnouncement = () => {
    const newAnnouncement = {
      id: Date.now(),
      content: "New Announcement",
    };
    setAnnouncements([...announcements, newAnnouncement]);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
  };

  const editAnnouncement = (id, newContent) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === id ? { ...announcement, content: newContent } : announcement
      )
    );
  };

  const toggleEditAnnouncement = (id) => {
    setEditAnnouncementId(editAnnouncementId === id ? null : id);
  };

  const addEvent = (date) => {
    const eventContent = prompt("Enter event details:");
    if (eventContent) {
      setEvents({
        ...events,
        [date.toDateString()]: eventContent,
      });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const eventExists = events[currentDay.toDateString()];

      days.push(
        <div
          key={i}
          className={`calendar-day ${eventExists ? "event-day" : ""}`}
          onClick={() => addEvent(currentDay)}
        >
          <span className="day-number">{i}</span>
          {eventExists && (
            <Eye
              className="view-event-icon"
              onClick={(e) => {
                e.stopPropagation();
                alert(events[currentDay.toDateString()]);
              }}
            />
          )}
          <Plus
            className="add-event-icon"
            onClick={(e) => {
              e.stopPropagation();
              addEvent(currentDay);
            }}
          />
        </div>
      );
    }
    return days;
  };

  return (
    <div className="smart-campus-connect">
      <nav className="navbar">
        <h1 className="app-title">SMART CAMPUS CONNECT</h1>
        <div className="nav-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="notification-button"
            onClick={handleNotificationClick}
          >
            <Bell />
            {unreadNotifications > 0 && <span className="notification-indicator" />}
          </button>
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <X
                  className="close-icon"
                  onClick={() => setShowNotifications(false)}
                />
              </div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                >
                  {notification.content}
                </div>
              ))}
            </div>
          )}
          <button
            className="logout-button mr-10"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="main-content">
        <aside className="sidebar">
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("home")}
          >
            <Home className="sidebar-icon" />
            <span>Home</span>
            <Plus
              className="add-icon"
              onClick={(e) => {
                e.stopPropagation();
                addAnnouncement();
              }}
            />
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("calendar")}
          >
            <Calendar className="sidebar-icon" />
            <span>Calendar</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("resources")}
          >
            <FileText className="sidebar-icon" />
            <span>Resources</span>
          </button>
          <button
            className="sidebar-button"
            onClick={() => handleSectionClick("messages")}
          >
            <MessageCircle className="sidebar-icon" />
            <span>Messages</span>
          </button>
        </aside>

        <main className="content-area">
          {activeSection === "home" && (
            <section className="announcements-section">
              <h2>Announcements</h2>
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  {editAnnouncementId === announcement.id ? (
                    <input
                      type="text"
                      value={announcement.content}
                      onChange={(e) =>
                        editAnnouncement(announcement.id, e.target.value)
                      }
                      onBlur={() => setEditAnnouncementId(null)}
                    />
                  ) : (
                    <span>{announcement.content}</span>
                  )}
                  <div className="announcement-actions">
                    <Edit3
                      className="action-icon"
                      onClick={() => toggleEditAnnouncement(announcement.id)}
                    />
                    <Trash
                      className="action-icon"
                      onClick={() => deleteAnnouncement(announcement.id)}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeSection === "calendar" && (
            <section className="calendar-section">
              <div className="calendar-header">
                <button
                  className="calendar-nav-button"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1
                      )
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <h2>
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  className="calendar-nav-button"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                      )
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="calendar-grid">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
                {renderCalendar()}
              </div>
            </section>
          )}

          {activeSection === "resources" && (
            <section className="resources-section">
              <h2>Resources</h2>
              <div className="resources-actions">
                <button
                  className="action-button"
                  onClick={() => addResource("file")}
                >
                  <Plus className="button-icon" />
                  Add File
                </button>
                <button
                  className="action-button"
                  onClick={() => addResource("folder")}
                >
                  <Folder className="button-icon" />
                  Add Folder
                </button>
              </div>
              <div className="resources-list">
                {resources.map((resource) => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-info">
                      {resource.type === "folder" ? (
                        <Folder className="resource-icon" />
                      ) : (
                        <FileText className="resource-icon" />
                      )}
                      <div>
                        <p className="resource-name">{resource.name}</p>
                        <p className="resource-uploader">
                          <User className="resource-uploader-icon" />
                          Added by {resource.addedBy}
                        </p>
                      </div>
                    </div>
                    <div className="resource-actions">
                      <button
                        className="icon-button"
                        onClick={() => viewResource(resource)}
                      >
                        <Eye className="action-icon" />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => deleteResource(resource.id)}
                      >
                        <Trash className="action-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "messages" && (
            <section className="messages-section">
              <h2>Messages</h2>
              <p>To be implemented: Messaging System</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}